// deno-lint-ignore-file no-explicit-any
import schema from "../data/schema.json" assert { "type": "json" };
import { isString } from "../deps.ts";

type Schema = typeof schema;

type graph = Schema["@graph"];

export interface Summary {
  name: string;

  description: string;
}

export interface Class extends Summary {
  properties: Summary[];
}

export function constructClass(
  id: string,
  json: Schema,
): Class | undefined {
  const subClasses = collectSubClass(id, json);

  if (!subClasses.length) return undefined;

  const head = subClasses[0];

  const propertyNodes = subClasses.map((node) => {
    return collectProperties(node["@id"], json);
  }).flat();

  const classSummary = makeSummary(head);
  const properties = propertyNodes.map(makeSummary);

  return {
    ...classSummary,
    properties,
  };
}

function makeSummary(node: graph[number]): Summary {
  return {
    name: resolveValueDirective(node["rdfs:label"]),
    description: resolveValueDirective(node["rdfs:comment"]),
  };
}

function resolveValueDirective(
  value: string | {
    "@language": string;
    "@value": string;
  },
): string {
  return isString(value) ? value : value["@value"];
}

function collectSubClass(id: string, json: Schema): typeof schema["@graph"] {
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

function collectProperties(id: string, json: Schema) {
  const graph = json["@graph"];

  const result = graph.filter((node) => {
    return filterTruthy(wrap(node["schema:domainIncludes"])).some((n) => {
      return n["@id"] === id;
    });
  });

  return result;
}

function wrap<T>(value: T): T extends readonly any[] ? T : T[] {
  return Array.isArray(value) ? value : [value] as any;
}

export function filterTruthy<T>(value: T[]): (Exclude<T, undefined | null>)[] {
  return value.filter(Boolean) as never;
}
