import { QueryResolvers } from "@/graphql_types.ts";
import SchemaOrg from "@/schemas/schema_org/model.ts";
import { Contexts } from "@/schemas/types.ts";

export const Query: QueryResolvers<Contexts> = {
  schemaOrg: (_, __, { schemaOrg }) => {
    return new SchemaOrg({ schemaOrg });
  },
};
