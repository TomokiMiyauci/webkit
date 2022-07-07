/** Compress GraphQL query. */
export function gql([query]: TemplateStringsArray): string {
  return query
    // replace multiple whitespace with a single
    .replace(/(\b|\B)\s+(\b|\B)/gm, " ")
    // remove all whitespace between everything except for word and word boundaries
    .replace(/(\B)\s+(\B)|(\b)\s+(\B)|(\B)\s+(\b)/gm, "")
    .trim();
}

type Params = {};

/** Tiny GraphQL fetch client. */
export function gqlFetch<R>(params: Readonly<Params>) {}