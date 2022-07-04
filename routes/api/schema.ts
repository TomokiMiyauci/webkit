import { Handlers } from "$fresh/server.ts";
import { isString } from "../../deps.ts";

const schema = await import("../../data/schema.json");

export const handler: Handlers = {
  GET() {
    const graph = schema["@graph"];

    const classes = graph.filter((g) => {
      const type = g["@type"];
      return isString(type) && type === "rdfs:Class";
    }).map(({ "rdfs:label": name }) => ({ name })).slice(0, 4);

    const res = new Response(JSON.stringify(classes), {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
      },
    });

    console.log(res);

    return res;
  },
};
