/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "@/components/Header.tsx";
import Main from "@/islands/Main.tsx";
import NavigationDrawer from "@/components/NavigationDrawer.tsx";
import {
  NodesAndClassNodeQuery,
  NodesAndClassNodeQueryVariables,
} from "@/graphql_types.ts";
import { tw } from "@twind";
import { handler as graphqlHandler } from "@/routes/graphql.ts";
import { gql, resolveResponse } from "@/utils/gqls.ts";
import { resolveErrorMsg } from "@/utils/errors.ts";

const query = gql`query NodesAndClassNode($id: String!,$hasType: Boolean!) {
  schemaOrg {
    nodes(type: CLASS) {
      id
      name
    }
    classNode(id: $id) @include(if: $hasType) {
      name
      description
      properties {
        name
        description
        schemas {
          name
          field
        }
        isPending
      }
    }
  }
}`;

export const handler: Handlers<NodesAndClassNodeQuery> = {
  async GET(req, ctx) {
    try {
      const url = new URL(req.url);
      const $type = url.searchParams.get("@type");
      const has$Type = !!$type;

      const graphqlUrl = new URL("/graphql", url);
      graphqlUrl.searchParams.set("query", query);

      const variables: NodesAndClassNodeQueryVariables = {
        hasType: has$Type,
        id: $type ?? "",
      };
      const varStr = JSON.stringify(variables);
      graphqlUrl.searchParams.set("variables", varStr);

      const request = new Request(graphqlUrl, req.clone());
      const res = await graphqlHandler(request, ctx);
      const data = await resolveResponse<NodesAndClassNodeQuery>(res);

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
  { data, url }: Readonly<PageProps<NodesAndClassNodeQuery>>,
): h.JSX.Element {
  return (
    <div
      class={tw
        `grid h-screen grid-rows-auto-auto-1 md:grid-rows-auto-1 md:grid-cols-auto-1`}
    >
      <Header
        class={tw
          `backdrop-blur backdrop-filter border-b px-4 py-2 md:row-span-1 md:col-span-3`}
      />

      <NavigationDrawer
        class={tw
          `border-r border-b bg-gray-50 px-4 py-2 shadow md:row-span-2 md:col-span-1 md:w-64`}
      />

      <Main
        url={url.toString()}
        class={tw
          `md:container mx-auto md:row-span-2 md:col-span-2 grid md:grid-cols-1 md:grid-cols-2 gap-8 overflow-y-auto p-2 md:p-0 grid-rows-1-auto`}
        schemaOrg={data.schemaOrg}
      />
      {/* <Footer class={tw`container mx-auto mt-20`} /> */}
    </div>
  );
}
