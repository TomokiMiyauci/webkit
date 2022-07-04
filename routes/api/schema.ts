import { Handlers } from "$fresh/server.ts";
import schema from "../../data/schema.json" assert { "type": "json" };
import { isString } from "../../deps.ts";

export const handler: Handlers = {
  GET() {
    const graph = schema["@graph"];

    const classes = graph.filter((g) => {
      const type = g["@type"];
      return isString(type) && type === "rdfs:Class";
    }).map(({ "rdfs:label": name }) => ({ name })).slice(0, 4);

    return new Response(JSON.stringify(classes), {
      "headers": {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });
  },
};
