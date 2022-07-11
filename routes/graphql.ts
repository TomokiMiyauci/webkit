import { Handler } from "$fresh/server.ts";
import { dirname, fromFileUrl, join } from "std/path/mod.ts";
import { resolvers } from "@/schemas/resolvers.ts";
import { makeExecutableSchema } from "@graphql-tools/schema";
import schemaOrg from "@/data/schema.json" assert { type: "json" };
import { graphqlHttp } from "graphql_http/mod.ts";

const fileUrl = fromFileUrl(import.meta.url);
const filePath = join(dirname(fileUrl), "..", "schemas", "schema.graphql");
const schemaStr = await Deno.readTextFile(filePath);
const schema = makeExecutableSchema({
  typeDefs: schemaStr,
  resolvers,
});

const GraphQLHTTP = graphqlHttp({
  schema,
  contextValue: {
    schemaOrg,
  },
  response: (res) => {
    if (res.ok) {
      const headers = new Headers(res.headers);
      headers.set("cache-control", "max-age=360");

      const customResponse = new Response(res.body, {
        ...res,
        headers,
      });
      return customResponse;
    }

    return res;
  },
  playground: true,
});

export const handler: Handler = GraphQLHTTP;
