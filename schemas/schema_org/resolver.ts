import nodes from "./nodes/resolver.ts";
import schemaOrg from "@/data/schema.json" assert { type: "json" };
import { resolveAbbreviatedValue, resolveIRI } from "@/utils/json_lds.ts";
import {
  RequireFields,
  SchemaOrgClassArgs,
} from "@/schemas/generated/graphql.ts";
import { ClassClass } from "@/schemas/nodes.ts";

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

  const rawNode = graph.find((node) => {
    const $id = resolveAbbreviatedValue(node["@id"], absoluteIRI, contexts);
    return $id === id;
  });
  if (!rawNode) return;

  const classClass = new ClassClass({ rawNode, schemaOrg });

  const { name, description, types, properties } = classClass;

  return resolveIRI({
    node: { id: classClass.id, name, description, types, properties },
    contexts,
    isAbsolute: absoluteIRI,
  });
};

const resolver = () => {
  return {
    nodes,
    nodeCount,
    class: cls,
  };
};

export default resolver;
