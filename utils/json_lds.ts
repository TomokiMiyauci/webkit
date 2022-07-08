import schemaOrg from "@/data/schema.json" assert { type: "json" };
import { filterTruthy, isString, wrap } from "../deps.ts";
import { Node } from "@/schemas/generated/graphql.ts";
import { marked } from "https://esm.sh/marked";
import { extension } from "./markdowns.ts";
import { mapValues } from "std/collections/map_values.ts";

marked.use(extension);

export type SchemaOrg = typeof schemaOrg;

export type RawNode = SchemaOrg["@graph"][number];

const reAbbreviatedFormat = /(.+):(.+)/;

export function isAbbreviated(value: string): value is `${string}:${string}` {
  return reAbbreviatedFormat.test(value);
}

export function resolveAbbreviatedValue(
  value: string,
  isAbsolute: boolean,
  contexts: Record<string, string>,
): string {
  const result = isAbbreviated(value)
    ? (() => {
      const [base, pathname] = value.split(":");

      if (base in contexts) {
        if (isAbsolute) {
          type Base = keyof typeof contexts;
          const baseUrl = contexts[base as Base];
          const url = new URL(pathname, baseUrl);

          return url.toString();
        }

        return pathname;
      }
      return "Unknown";
    })()
    : value;

  return result;
}

type Params = {
  node: Node;
  contexts: Record<string, string>;
  isAbsolute: boolean;
};

export function resolveIRI(
  { node, contexts, isAbsolute }: Readonly<Params>,
): Node {
  const newNode = mapValues(node, (value) => {
    const result = isString(value)
      ? resolveAbbreviatedValue(value, isAbsolute, contexts)
      : value.map((v) => resolveAbbreviatedValue(v, isAbsolute, contexts));

    return result;
  }) as Node;

  return newNode;
}

export interface Language {
  "@language": string;
  "@value": string;
}

export function resolveLanguage(
  value: string | Language,
): string {
  if (isString(value)) {
    return value;
  }

  return value["@value"];
}

export function filterType(value: string | string[]): boolean {
  return wrap(value).some((type) => type === "rdfs:Class");
}

export function collectSubClass(
  id: string,
  json: SchemaOrg,
): SchemaOrg["@graph"] {
  const run = (
    ...[id, json]: Parameters<typeof collectSubClass>
  ): ReturnType<typeof collectSubClass> => {
    const graph = json["@graph"];

    const maybeNode = graph.find((node) => {
      return node["@id"] === id;
    });

    if (!maybeNode) return [];

    const getChildren = () => {
      const children = filterTruthy(wrap(maybeNode["rdfs:subClassOf"])).map(
        (node) => {
          return run(node["@id"], json);
        },
      );
      return children.flat();
    };

    return [maybeNode, ...getChildren()];
  };

  return run(id, json);
}

export function collectProperties(id: string, schemaOrg: SchemaOrg) {
  const graph = schemaOrg["@graph"];

  const result = graph.filter((node) => {
    return filterTruthy(wrap(node["schema:domainIncludes"])).some((n) => {
      return n["@id"] === id;
    });
  });

  return result;
}

export function collectNodes<T extends keyof RawNode>(
  rawNode: RawNode,
  _: T,
  graph: SchemaOrg["@graph"],
) {
  const ids = filterTruthy(wrap(rawNode["schema:rangeIncludes"]));

  const subClasses = ids.map(({ "@id": id }) => {
    return graph.filter((node) => {
      return node["@id"] === id;
    });
  }).flat();

  return subClasses;
}

export function isPending(
  value: unknown,
): value is "https://pending.schema.org" {
  return "https://pending.schema.org" === value;
}
