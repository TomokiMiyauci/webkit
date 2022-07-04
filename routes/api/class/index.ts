import { Handlers } from "$fresh/server.ts";
import schema from "../../../data/schema.json" assert { "type": "json" };
import { constructClass } from "../../../utils/json_ld_convert.ts";

export const handler: Handlers = {
  GET(req) {
    const url = new URL(req.url);
    const id = url.searchParams.get("@id");

    if (!id) {
      return new Response("@id parameter is required.", {
        status: 400,
      });
    }

    const result = constructClass(id, schema);

    if (!result) {
      return new Response("Resources is not founded.", {
        status: 404,
      });
    }

    return new Response(JSON.stringify(result), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
};
