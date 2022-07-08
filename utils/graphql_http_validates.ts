import { json, jsonParse } from "@/utils/jsons.ts";
import { parseMediaType } from "std/media_types/mod.ts";
import { isNull, isObject, isString } from "isx/mod.ts";

export type Result = [valid: true, data: {
  query: string;
  variableValues?: Record<string, unknown> | null;
  operationName?: string | null;
}] | [valid: false, error: Error];

export function validateRequest(req: Request): Promise<Result> | Result {
  const method = req.method;

  switch (method) {
    case "GET": {
      return validateGetRequest(req);
    }
    case "POST": {
      return validatePostRequest(req);
    }
    default: {
      return [false, new Error("Invalid HTTP method.")];
    }
  }
}

export function validateGetRequest(req: Request): Result {
  const url = new URL(req.url);

  const source = url.searchParams.get("query");
  if (!source) {
    return [false, new Error(`"query" parameter is required.`)];
  }
  const variables = url.searchParams.get("variables");
  const variableValues = variables
    ? (() => {
      const result = jsonParse(variables);
      if (
        result[0] && isPlainObject(result[1])
      ) {
        return result[1];
      }
      return null;
    })()
    : null;
  const operationName = url.searchParams.get("operationName");

  return [true, {
    query: source,
    variableValues,
    operationName,
  }];
}

export async function validatePostRequest(req: Request): Promise<Result> {
  const contentType = req.headers.get("content-type");
  if (!contentType) {
    return [false, TypeError(`"content-type" header is required.`)];
  }

  const [mediaType] = parseMediaType(contentType);

  switch (mediaType) {
    case "application/json": {
      const data = await req.json() as Partial<json>;
      if (isPlainObject(data)) {
        const { query, operationName = null, variables = null } = data;

        if (!isString(query)) {
          return [false, TypeError(`"query" must be string.`)];
        }

        if (!isPlainObject(variables)) {
          return [false, TypeError(`"variables" must be JSON format.`)];
        }
        if (!isStringOrNull(operationName)) {
          return [false, TypeError(`"operationName" must be string or null.`)];
        }

        return [true, {
          query,
          operationName,
          variableValues: variables,
        }];
      }
      return [false, new Error("")];
    }

    case "application/graphql": {
      const query = await req.text();
      if (!query) {
        return [false, Error("GraphQL query is required in request body.")];
      }
      return [true, { query }];
    }

    default: {
      return [false, new Error("Invalid media type.")];
    }
  }
}

function isPlainObject(value: unknown): value is Record<PropertyKey, unknown> {
  return isObject(value) && value.constructor === Object;
}

function isStringOrNull(value: unknown): value is string | null {
  return isString(value) || isNull(value);
}
