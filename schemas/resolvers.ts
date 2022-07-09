import { Resolvers } from "@/graphql_types.ts";
import { Query } from "@/schemas/query/resolvers.ts";
import { SchemaOrg } from "@/schemas/schema_org/resolvers.ts";
import { Contexts } from "@/schemas/types.ts";

export const resolvers: Resolvers<Contexts> = {
  Query,
  SchemaOrg,
};
