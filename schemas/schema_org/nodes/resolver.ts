import schemaOrg from "../../../data/schema.json" assert { type: "json" };
import { filterType, formatNode } from "../../../utils/json_lds.ts";

type Type = "CLASS" | "ALL";

interface Args {
  type: Type;
}

const resolver = ({ type }: Args) => {
  const graph = schemaOrg["@graph"];

  const g = type === "ALL"
    ? graph
    : graph.filter((node) => filterType(node["@type"]));

  return g.map((node) => formatNode(node, schemaOrg));
};

export default resolver;
