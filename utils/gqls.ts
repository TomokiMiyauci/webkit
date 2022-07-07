/** Compress GraphQL query. */
export function gql([query]: TemplateStringsArray): string {
  return query
    // replace multiple whitespace with a single
    .replace(/(\b|\B)\s+(\b|\B)/gm, " ")
    // remove all whitespace between everything except for word and word boundaries
    .replace(/(\B)\s+(\B)|(\b)\s+(\B)|(\B)\s+(\b)/gm, "")
    .trim();
}

type json = string | number | boolean | null | { [k: string]: json } | json[];

type Params = {
  /** GraphQL query */
  query: string;

  /** GraphQL endpoint. */
  endpoint: URL;
};

type Options = {
  /** GraphQL variables. */
  variables: json;
};

/** Tiny GraphQL fetch client. */
export async function gqlFetch<R extends Record<string, unknown>>(
  { endpoint, query }: Readonly<Params>,
  { variables }: Readonly<Partial<Options>> = {},
  init?: RequestInit,
): Promise<R> {
  endpoint.searchParams.set("query", query);
  if (variables) {
    const varStr = JSON.stringify(variables);
    endpoint.searchParams.set("variables", varStr);
  }

  const res = await fetch(endpoint, init);
  return resolveResponse<R>(res);
}

type GqlLocation = { line: number; column: number };
type GqlError = { message: string; locations: GqlLocation[] };

export type Result<
  T extends Record<string, unknown> = Record<string, unknown>,
> = {
  data?: T;
  errors?: GqlError[];
};

export async function resolveResponse<R extends Record<string, unknown>>(
  res: Response,
): Promise<R> {
  if (!res.ok) {
    throw Error(res.statusText);
  }
  const { data, errors } = await (res.json() as Promise<Result<R>>);

  if (errors) {
    const e = errors.map(({ message }) => Error(message));
    throw new AggregateError(e, `Query result contains one or more errors.`);
  }
  if (!data) {
    throw TypeError(`Query result has no "data" field.`);
  }

  return data;
}
