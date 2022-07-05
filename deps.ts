// deno-lint-ignore-file no-explicit-any

export { default as clsx } from "https://esm.sh/clsx@1.1.1";
export { filterValues } from "https://deno.land/std@0.145.0/collections/filter_values.ts";
export {
  isObject,
  isString,
} from "https://deno.land/x/isx@v1.0.0-beta.17/mod.ts";

export function wrap<T>(value: T): T extends readonly any[] ? T : T[] {
  return Array.isArray(value) ? value : [value] as any;
}

export function filterTruthy<T>(value: T[]): (Exclude<T, undefined | null>)[] {
  return value.filter(Boolean) as never;
}

export type json = string | number | null | boolean | json[] | jsonObject;

export type jsonObject = {
  [k: string]: json;
};
