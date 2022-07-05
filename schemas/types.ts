export type Result<D = unknown> = {
  data: D;

  // deno-lint-ignore no-explicit-any
  errors?: any[];
};
