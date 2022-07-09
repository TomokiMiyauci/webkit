import { ClassNodeResolvers, Sort } from "@/graphql_types.ts";
import { Contexts } from "@/schemas/types.ts";
import { sortBy } from "std/collections/sort_by.ts";

export const ClassNode: ClassNodeResolvers<Contexts> = {
  properties: (parent, { orderBy }) => {
    if (!orderBy || !orderBy.isPending) return parent.properties;

    const isPendingOrderBy = orderBy.isPending;

    const properties = sortBy(
      parent.properties,
      ({ isPending }) => compareByBoolean(isPending, isPendingOrderBy),
    );
    return properties;
  },
};

function compareByBoolean(value: boolean, sortBy: Sort): number {
  const v = sortBy === "DESC" ? value : !value;
  return Number(v);
}
