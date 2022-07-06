import schemaOrg from "../../../data/schema.json" assert { type: "json" };
import { filterType, formatNode, resolveIRI } from "../../../utils/json_lds.ts";
import { SchemaOrgNodesArgs, RequireFields } from "@/schemas/generated/graphql.ts";

const resolver = (
  { type, absoluteIRI }: RequireFields<SchemaOrgNodesArgs, "type" | "absoluteIRI">,
) => {
  const graph = schemaOrg["@graph"];
  const contexts = schemaOrg["@context"];

  const g = type === "ALL"
    ? graph
    : graph.filter((node) => filterType(node["@type"]));

  const nodes = g.map(formatNode);

  return nodes.map((node) => resolveIRI({ node, isAbsolute: absoluteIRI, contexts }));
};

export default resolver;
