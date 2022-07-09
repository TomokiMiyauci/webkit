import { filterTruthy, isString, wrap } from "../deps.ts";
import { Node } from "@/graphql_types.ts";
import { marked } from "https://esm.sh/marked";
import { extension } from "./markdowns.ts";
import { mapValues } from "std/collections/map_values.ts";
import { RawNode, SchemaOrgTypes } from "@/types.ts";

marked.use(extension);

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

export function searchNode(
  id: string,
  schemaOrg: SchemaOrgTypes,
): RawNode | undefined {
  const maybeNode = schemaOrg["@graph"].find((node) => {
    return node["@id"] === id;
  });

  return maybeNode;
}

export function collectSubClass(
  rootNode: RawNode,
  json: SchemaOrgTypes,
): SchemaOrgTypes["@graph"] {
  const seen = new Set<string>();

  const run = (
    ...[rawNode, json]: Parameters<typeof collectSubClass>
  ): ReturnType<typeof collectSubClass> => {
    const children = filterTruthy(wrap(rawNode["rdfs:subClassOf"])).map(
      (childNode) => {
        if (seen.has(childNode["@id"])) return [];

        const rawNode = searchNode(childNode["@id"], json);
        if (!rawNode) return [];
        seen.add(rawNode["@id"]);
        return [rawNode, ...run(rawNode, json)];
      },
    );
    return children.flat();
  };

  return run(rootNode, json);
}

export function collectProperties(rawNode: RawNode, schemaOrg: SchemaOrgTypes) {
  const graph = schemaOrg["@graph"];

  const result = graph.filter((node) => {
    return filterTruthy(wrap(node["schema:domainIncludes"])).some((n) => {
      return n["@id"] === rawNode["@id"];
    });
  });

  return result;
}

export function collectNodes<T extends keyof RawNode>(
  rawNode: RawNode,
  _: T,
  graph: SchemaOrgTypes["@graph"],
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
