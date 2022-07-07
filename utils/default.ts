// deno-lint-ignore-file no-explicit-any
export function defineDefault<
  F extends (...args: Record<PropertyKey, unknown>[]) => any,
>(
  fn: F,
  ...defaultArgs: Parameters<F>
) {
  return ((...args: Parameters<F>) => {
    const mergedArgs = defaultArgs.map((defaultArg, i) => {
      return {
        ...defaultArg,
        ...args[i],
      };
    });
    return fn.apply(null, mergedArgs) as ReturnType<F>;
  });
}

export function lazy<F extends (...args: readonly any[]) => any>(fn: () => F) {
  return (...args: Parameters<F>) => fn.call(null).apply(null, args);
}
