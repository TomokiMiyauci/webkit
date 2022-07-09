import { Handler } from "$fresh/server.ts";
import { dirname, fromFileUrl, join } from "std/path/mod.ts";
import { contentType } from "std/media_types/mod.ts";
import { graphql } from "graphql";
import { resolveErrorMsg } from "@/utils/errors.ts";
import { validateRequest } from "@/utils/graphql_http_validates.ts";
import { resolvers } from "@/schemas/resolvers.ts";
import { makeExecutableSchema } from "@graphql-tools/schema";
import schemaOrg from "@/data/schema.json" assert { type: "json" };

const fileUrl = fromFileUrl(import.meta.url);
const filePath = join(dirname(fileUrl), "..", "schemas", "schema.graphql");
const schemaStr = await Deno.readTextFile(filePath);
const schema = makeExecutableSchema({
  typeDefs: schemaStr,
  resolvers,
});

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
      variableValues,
      operationName,
      contextValue: {
        schemaOrg,
      },
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
