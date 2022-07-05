import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  GET() {
    console.log(Deno.readTextFile);

    return new Response("hello");
  },
};
