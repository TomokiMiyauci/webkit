import nodes from "./nodes/resolver.ts";
import schemaOrg from "@/data/schema.json" assert { type: "json" };
import {
  constructProperties,
  formatNode,
  resolveAbbreviatedValue,
  resolveIRI,
} from "@/utils/json_lds.ts";
import {
  RequireFields,
  SchemaOrgClassArgs,
} from "@/schemas/generated/graphql.ts";

const nodeCount = (): number => {
  const graph = schemaOrg["@graph"];

  const length = graph.filter((node) => {
    return node["@type"] === "rdfs:Class";
  }).length;

  return length;
};

const cls = (
  { id, absoluteIRI }: RequireFields<
    SchemaOrgClassArgs,
    "absoluteIRI" | "id"
  >,
) => {
  const graph = schemaOrg["@graph"];
  const contexts = schemaOrg["@context"];

  const node = graph.find((node) => {
    const $id = resolveAbbreviatedValue(node["@id"], absoluteIRI, contexts);
    return $id === id;
  });
  if (!node) return;

  const properties = constructProperties(node["@id"], schemaOrg);

  return {
    ...resolveIRI({
      node: formatNode(node),
      contexts,
      isAbsolute: absoluteIRI,
    }),
    properties,
  };
};

const resolver = () => {
  return {
    nodes,
    nodeCount,
    class: cls,
  };
};

export default resolver;
