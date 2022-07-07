import { Handlers } from "$fresh/server.ts";
import rootValue from "@/schemas/mod.ts";
import { dirname, fromFileUrl, join } from "std/path/mod.ts";
import { contentType } from "std/media_types/mod.ts";
import { buildSchema, graphql } from "graphql";
import { resolveErrorMsg } from "@/utils/errors.ts";

const fileUrl = fromFileUrl(import.meta.url);
const filePath = join(dirname(fileUrl), "..", "schemas", "schema.graphql");
const schemaData = await Deno.readTextFile(filePath);
const schema = buildSchema(schemaData);

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const source = url.searchParams.get("query");
    const variables = url.searchParams.get("variables");
    const variableValues = variables ? JSON.parse(variables) : undefined;

    if (!source) {
      const res = new Response(`"query" parameter is required.`, {
        status: 400,
      });
      return res;
    }

    try {
      const result = await graphql({
        schema,
        source,
        rootValue,
        variableValues,
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
  },
};
