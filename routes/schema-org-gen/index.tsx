/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "@/components/Header.tsx";
import Main from "@/islands/Main.tsx";
import NavigationDrawer from "@/components/NavigationDrawer.tsx";
import {
  NodesAndClassQuery,
  NodesAndClassQueryVariables,
} from "@/schemas/generated/graphql.ts";
import { tw } from "@twind";
import { handler as graphqlHandler } from "@/routes/graphql.ts";
import { gql, resolveResponse } from "@/utils/gqls.ts";
import { resolveErrorMsg } from "@/utils/errors.ts";

const query = gql`query NodesAndClass($id: String!,$hasType: Boolean!) {
  schemaOrg {
    nodes(type: CLASS) {
      id
      name
    }
    class(id: $id) @include(if: $hasType) {
      name
      description
      properties {
        name
        description
        schemas {
          name
          field
        }
      }
    }
  }
}`;

export const handler: Handlers<NodesAndClassQuery> = {
  async GET(req, ctx) {
    try {
      const url = new URL(req.url);
      const $type = url.searchParams.get("@type");
      const has$Type = !!$type;

      const graphqlUrl = new URL("/graphql", url);
      graphqlUrl.searchParams.set("query", query);

      const variables: NodesAndClassQueryVariables = {
        hasType: has$Type,
        id: $type ?? "",
      };
      const varStr = JSON.stringify(variables);
      graphqlUrl.searchParams.set("variables", varStr);

      const request = new Request(graphqlUrl, req.clone());
      const res = await graphqlHandler["GET"]!(request, ctx);
      const data = await resolveResponse<NodesAndClassQuery>(res);

      return ctx.render(data);
    } catch (e) {
      const msg = resolveErrorMsg(e);

      return new Response(msg, {
        status: 500,
      });
    }
  },
};

export default function Home(
  { data, url }: Readonly<PageProps<NodesAndClassQuery>>,
): h.JSX.Element {
  return (
    <div
      class={tw`md:grid md:h-screen grid-rows-auto-1 grid-cols-auto-1`}
    >
      <Header
        class={tw
          `backdrop-blur backdrop-filter border-b px-4 py-2 row-span-1 col-span-3`}
      />

      <NavigationDrawer
        class={tw
          `border-r border-b bg-gray-50 px-4 py-2 shadow row-span-2 col-span-1 md:w-64`}
      />

      <Main
        url={url.toString()}
        class={tw
          `container mx-auto row-span-2 col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto p-2 md:p-0`}
        schemaOrg={data.schemaOrg}
      />
      {/* <Footer class={tw`container mx-auto mt-20`} /> */}
    </div>
  );
}
