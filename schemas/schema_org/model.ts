import { SchemaOrg as _SchemaOrg } from "@/graphql_types.ts";
import { RawNode, SchemaOrgTypes } from "@/types.ts";
import { ClassNode, PropertyNode } from "@/models/nodes.ts";
import { filterType } from "@/utils/json_lds.ts";

export default class SchemaOrg implements _SchemaOrg {
  #schemaOrg: SchemaOrgTypes;
  #rawNode: RawNode | undefined;
  constructor(
    { schemaOrg, rawNode }: Readonly<
      { schemaOrg: SchemaOrgTypes; rawNode?: RawNode }
    >,
  ) {
    this.#schemaOrg = schemaOrg;
    this.#rawNode = rawNode;
  }
  get nodes() {
    const graph = this.#schemaOrg["@graph"];
    const g = graph.filter((node) => filterType(node["@type"]));

    const nodes = g.map((rawNode) => {
      return new PropertyNode({ rawNode, schemaOrg: this.#schemaOrg });
    });
    return nodes;
  }

  get nodeCount() {
    const graph = this.#schemaOrg["@graph"];

    const length = graph.filter((node) => {
      return node["@type"] === "rdfs:Class";
    }).length;

    return length;
  }

  get class() {
    if (!this.#rawNode) return undefined;
    const Class = new ClassNode({
      rawNode: this.#rawNode,
      schemaOrg: this.#schemaOrg,
    });

    return Class;
  }
}
