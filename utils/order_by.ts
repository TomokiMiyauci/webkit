import { isBoolean } from "isx/isBoolean/mod.ts";

type OrderEntry = [key: PropertyKey, isAsc: boolean] | [
  key: PropertyKey,
  by: Asc | Desc,
];

type Asc = "asc" | "ASC" | "Asc";
type Desc = "desc" | "Desc" | "DESC";

export function orderBy<
  // deno-lint-ignore no-explicit-any
  T extends Record<PropertyKey, any>,
>(
  target: Readonly<Iterable<Readonly<T>>>,
  entries: Readonly<Iterable<Readonly<OrderEntry>>>,
): T[] {
  return Array.from(target).sort((a, b) => {
    for (const [key, by] of entries) {
      const hasA = key in a;
      const hasB = key in b;
      if (!hasA && !hasB) {
        continue;
      }
      if (!hasA) {
        return 1;
      }
      if (!hasB) {
        return -1;
      }
      const valueA = a[key];
      const valueB = b[key];
      const isAsc = isBoolean(by) ? by : by.toLowerCase() === "asc";
      const [left, right] = isAsc ? [valueA, valueB] : [valueB, valueA];
      const result = left > right ? 1 : left < right ? -1 : 0;

      if (result) {
        return result;
      }
    }
    return 0;
  });
}
