// deno-lint-ignore-file no-explicit-any
import { isFunction } from "isx/mod.ts";

type Params<F extends (...args: any[]) => any> = {
  args: Parameters<F>;
  merge: (
    defaultArg: Parameters<F>[number],
    arg: Parameters<F>[number],
  ) => Parameters<F>[number];
};

export function defineDefault<F extends (...args: any[]) => any>(
  fn: F,
  params: Readonly<Params<F>>,
): (
  ...args: Parameters<F>
) => ReturnType<F>;

export function defineDefault<F extends (...args: any[]) => any>(
  fn: F,
  ...defaultArgs: Parameters<F>
): (
  ...args: Parameters<F>
) => ReturnType<F>;

export function defineDefault<
  F extends (...args: Record<PropertyKey, unknown>[]) => any,
>(
  fn: F,
  ...defaultArgs: Parameters<F> | [Params<F>]
): (...args: Parameters<F>) => ReturnType<F> {
  return ((...args: Parameters<F>) => {
    const { args: dArgs, merge } = isParamsSyntax(defaultArgs)
      ? defaultArgs[0]
      : { args: defaultArgs, merge: defaultMerge };

    const mergedArgs = dArgs.map((defaultArg, i) => {
      return merge(defaultArg, args[i]);
    });
    return fn.apply(null, mergedArgs) as ReturnType<F>;
  });
}

function defaultMerge(
  a: Record<PropertyKey, unknown>,
  b: Record<PropertyKey, unknown>,
): Record<PropertyKey, unknown> {
  return {
    ...a,
    ...b,
  };
}

export function lazy<F extends (...args: readonly any[]) => any>(fn: () => F) {
  return (...args: Parameters<F>) => fn.call(null).apply(null, args);
}

function isParamsSyntax<
  F extends (...args: Record<PropertyKey, unknown>[]) => any,
>(values: readonly Record<PropertyKey, unknown>[]): values is [Params<F>] {
  const head = values[0];

  return values.length === 1 && "args" in head && Array.isArray(head.args) &&
    "merge" in head && isFunction(head.merge);
}
