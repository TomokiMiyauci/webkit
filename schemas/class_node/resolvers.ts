import { ClassNodeResolvers } from "@/graphql_types.ts";
import { Contexts } from "@/schemas/types.ts";
import { orderBy as sortBy } from "@/utils/order_by.ts";

export const ClassNode: ClassNodeResolvers<Contexts> = {
  properties: (parent, { orderBy }) => {
    if (!orderBy) return parent.properties;

    const entries = orderBy.map(({ key, by }) => [key, by] as const);
    const properties = sortBy(parent.properties, entries);

    return properties;
  },
};
