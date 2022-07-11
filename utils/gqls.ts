import { json } from "pure_json/mod.ts";

/** Compress GraphQL query. */
export function gql([query]: TemplateStringsArray): string {
  return query
    // replace multiple whitespace with a single
    .replace(/(\b|\B)\s+(\b|\B)/gm, " ")
    // remove all whitespace between everything except for word and word boundaries
    .replace(/(\B)\s+(\B)|(\b)\s+(\B)|(\B)\s+(\b)/gm, "")
    .trim();
}

export type Params = {
  /** GraphQL query */
  query: string;

  /** GraphQL endpoint. */
  endpoint: URL;
};

export type Options = {
  /** GraphQL variables. */
  variables: json;

  /** HTTP Request method.
   * @default `GET`
   */
  // deno-lint-ignore ban-types
  method: "GET" | "POST" | ({} & string);
};

/** Tiny GraphQL fetch client.
 * @throws {@link TypeError} {@link DOMException}
 */
export async function fetchGql<R extends Record<string, unknown>>(
  { endpoint, query }: Readonly<Params>,
  { variables, method }: Readonly<Partial<Options>> = {},
  init?: RequestInit,
): Promise<R> {
  method = init?.method ?? "GET";
  if (method === "GET") {
    endpoint.searchParams.set("query", query);
    if (variables) {
      const varStr = JSON.stringify(variables);
      endpoint.searchParams.set("variables", varStr);
    }
  }

  const res = await fetch(endpoint, {
    method,
    body: method === "POST" ? JSON.stringify({ query, variables }) : undefined,
    headers: {
      "content-type": "application/json; charset=UTF-8",
      "accept": "application/json",
    },
    ...init,
  });
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
