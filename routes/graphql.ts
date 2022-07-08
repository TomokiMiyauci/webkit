import { Handler } from "$fresh/server.ts";
import rootValue from "@/schemas/mod.ts";
import { dirname, fromFileUrl, join } from "std/path/mod.ts";
import { contentType } from "std/media_types/mod.ts";
import { buildSchema, graphql } from "graphql";
import { resolveErrorMsg } from "@/utils/errors.ts";
import { validateRequest } from "@/utils/graphql_http_validates.ts";

const fileUrl = fromFileUrl(import.meta.url);
const filePath = join(dirname(fileUrl), "..", "schemas", "schema.graphql");
const schemaData = await Deno.readTextFile(filePath);
const schema = buildSchema(schemaData);

export const handler: Handler = async (req) => {
  const result = await validateRequest(req);
  if (!result[0]) {
    return new Response(result[1].message, {
      status: 400,
    });
  }

  const { query: source, variableValues, operationName } = result[1];

  try {
    const result = await graphql({
      schema,
      source,
      rootValue,
      variableValues,
      operationName,
    });
    const res = new Response(JSON.stringify(result), {
      headers: {
        "content-type": contentType(".json"),
        "cache-control": "max-age=60",
      },
    });
    return res;
  } catch (e) {
    const msg = resolveErrorMsg(e);
    const res = new Response(msg, {
      status: 500,
    });
    return res;
  }
};
