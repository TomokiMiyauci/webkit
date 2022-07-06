import schemaOrg from "../data/schema.json" assert { type: "json" };
import { filterTruthy, isString, wrap } from "../deps.ts";
import { Property } from "../schemas/generated/graphql.ts";
import { marked } from "https://esm.sh/marked";
import { isAbsolute } from "std/path/mod.ts";

export type SchemaOrg = typeof schemaOrg;

export type RawNode = SchemaOrg["@graph"][number];

const reAbbreviatedFormat = /(.+):(.+)/;

export function isAbbreviated(value: string): value is `${string}:${string}` {
  return reAbbreviatedFormat.test(value);
}

export function resolveRelativeIRI(
  value: string,
  schemaOrg: SchemaOrg,
): string {
  const result = isAbbreviated(value)
    ? (() => {
      const contexts = schemaOrg["@context"];
      const [base, pathname] = value.split(":");

      if (base in contexts) {
        type Base = keyof typeof contexts;
        const baseUrl = contexts[base as Base];
        const url = new URL(pathname, baseUrl);

        return url.toString();
      }
      return "Unknown";
    })()
    : value;

  return result;
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

function resolveId(
  rawNode: RawNode,
  schemaOrg: SchemaOrg,
): string {
  const _id = rawNode["@id"];

  const id = resolveRelativeIRI(_id, schemaOrg);
  return id;
}

interface Node {
  id: string;
  type: string[];
  name: string;
  description: string;
}

export function resolveType(rawNode: RawNode, schemaOrg: SchemaOrg): string[] {
  return wrap(rawNode["@type"]).map((type) => {
    return resolveRelativeIRI(type, schemaOrg);
  });
}

export function formatNode(rawNode: RawNode, schemaOrg: SchemaOrg): Node {
  const id = resolveId(rawNode, schemaOrg);
  const type = resolveType(rawNode, schemaOrg);
  const name = resolveLanguage(rawNode["rdfs:label"]);

  const renderer = new marked.Renderer();
  const DOC_BASE_URL = "https://schema.org";
  renderer.link = (href, _, text) => {
    href = href ?? "";
    console.log(href);
    console.log(isAbsolute(href), href);
    href = isAbsolute(href) ? new URL(href, DOC_BASE_URL).toString() : href;
    return `<a target="_blank" href="${href}">${text}</a>`;
  };
  marked.use({
    breaks: true,
    baseUrl: "https://schema.org",
    renderer,
    tokenizer: {
      link(src) {
        const match = src.match(/^\[\[(.+?)\]\]/);

        if (match) {
          return {
            type: "link",
            raw: match[0],
            text: match[1],
            href: `/${match[1]}`,
            title: "",
            tokens: [
              {
                type: "text",
                raw: match[1],
                text: match[1],
              },
            ],
          };
        }

        return false;
      },
    },
  });
  const description = marked(
    resolveLanguage(rawNode["rdfs:comment"]).replaceAll("\n\n", "\n"),
  );

  return {
    id,
    type,
    name,
    description,
  };
}

export function filterType(value: string | string[]): boolean {
  return wrap(value).some((type) => type === "rdfs:Class");
}

export function constructProperties(
  id: string,
  json: SchemaOrg,
): Property[] | undefined {
  const subClasses = collectSubClass(id, json);

  if (!subClasses.length) return undefined;
  const propertyNodes = subClasses.map((node) => {
    return collectProperties(node["@id"], json);
  }).flat();

  const properties = propertyNodes.map((node) => formatNode(node, json));

  return properties;
}

function collectSubClass(id: string, json: SchemaOrg): SchemaOrg["@graph"] {
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

function collectProperties(id: string, schemaOrg: SchemaOrg) {
  const graph = schemaOrg["@graph"];

  const result = graph.filter((node) => {
    return filterTruthy(wrap(node["schema:domainIncludes"])).some((n) => {
      return n["@id"] === id;
    });
  });

  return result;
}
