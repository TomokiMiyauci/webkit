/** @jsx h */
import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { json } from "@/deps.ts";
import { tw } from "@twind";
import { jsonStringify } from "@/utils/jsons.ts";
import { contentType } from "std/media_types/mod.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const url = new URL(req.url);
    const graphqlUrl = new URL("/graphql", url);

    const maybeQuery = url.searchParams.get("query");
    if (!maybeQuery) {
      return ctx.render();
    }

    graphqlUrl.searchParams.set("query", maybeQuery);
    const res = await fetch(graphqlUrl);

    const { data, errors } = await res.json() as {
      data: json;
      errors?: json[];
    };

    if (errors) {
      const result = jsonStringify(errors);
      if (!result[0]) {
        return new Response(result[1].message, {
          status: 500,
          headers: {
            "content-type": contentType("txt"),
          },
        });
      }
      const res = new Response(result[1], {
        status: 500,
        headers: {
          "content-type": contentType(".json"),
        },
      });

      return res;
    }

    return ctx.render(data);
  },
};

export default function Page(page: PageProps<json | undefined>) {
  const url = new URL(page.url);
  const query = url.searchParams.get("query") ?? "";
  const result = jsonStringify(page.data);

  return (
    <main class={tw`w-1/2 mx-auto`}>
      <form method="get">
        <ul>
          <li>
            <label for="query">
              Query
            </label>
            <p>
              <textarea
                id="query"
                class={tw
                  `border rounded-md p-2 w-1/2 shadow focus:ring focus:outline-none h-96`}
                name="query"
                value={query}
              >
              </textarea>
            </p>
          </li>
        </ul>

        <button class={tw`rounded-md border shadow p-1`} type="submit">
          submit
        </button>
      </form>

      {result[0] && (
        <pre>
          <code>
            {result[1]}
          </code>
        </pre>
      )}
    </main>
  );
}
