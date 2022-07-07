import schemaOrg from "@/data/schema.json" assert { type: "json" };
import { filterType, resolveIRI } from "@/utils/json_lds.ts";
import {
  RequireFields,
  SchemaOrgNodesArgs,
} from "@/schemas/generated/graphql.ts";
import { NodeClass } from "@/schemas/nodes.ts";

const resolver = (
  { type, absoluteIRI }: RequireFields<
    SchemaOrgNodesArgs,
    "type" | "absoluteIRI"
  >,
) => {
  const graph = schemaOrg["@graph"];
  const contexts = schemaOrg["@context"];

  const g = type === "ALL"
    ? graph
    : graph.filter((node) => filterType(node["@type"]));

  const nodes = g.map((node) => new NodeClass({ rawNode: node }));

  return nodes.map(({ name, description, id, types }) =>
    resolveIRI({
      node: { name, description, id, types },
      isAbsolute: absoluteIRI,
      contexts,
    })
  );
};

export default resolver;
