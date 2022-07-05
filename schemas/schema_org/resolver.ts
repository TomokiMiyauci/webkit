import nodes from "./nodes/resolver.ts";
import schemaOrg from "../../data/schema.json" assert { type: "json" };
import {
  constructProperties,
  formatNode,
  resolveRelativeIRI,
} from "../../utils/json_lds.ts";

const nodeCount = (): number => {
  const graph = schemaOrg["@graph"];

  const length = graph.filter((node) => {
    return node["@type"] === "rdfs:Class";
  }).length;

  return length;
};

const cls = ({ id }: { id: string }) => {
  const graph = schemaOrg["@graph"];
  const node = graph.find((node) =>
    resolveRelativeIRI(node["@id"], schemaOrg) === id
  );
  if (!node) return;

  const properties = constructProperties(node["@id"], schemaOrg);

  return { ...formatNode(node, schemaOrg), properties };
};

const resolver = () => {
  return {
    nodes,
    nodeCount,
    class: cls,
  };
};

export default resolver;
