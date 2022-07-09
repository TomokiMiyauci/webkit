import { SchemaOrgResolvers } from "@/graphql_types.ts";
import { Contexts } from "@/schemas/types.ts";
import SchemaOrgClass from "@/schemas/schema_org/model.ts";

export const SchemaOrg: SchemaOrgResolvers<Contexts> = {
  classNode: (_, { id, absoluteIRI }, { schemaOrg }) => {
    const graph = schemaOrg["@graph"];
    const contexts = schemaOrg["@context"];

    const rawNode = graph.find((node) => {
      if (node["@id"] === "schema:Thing") {
        console.log(node["@id"] === "schema:Thing");
      }
      return node["@id"] === id;
      // const $id = resolveAbbreviatedValue(node["@id"], absoluteIRI, contexts);
      // return $id === id;
    });
    if (!rawNode) return null;

    return new SchemaOrgClass({ schemaOrg, rawNode }).class ?? null;
  },
};
