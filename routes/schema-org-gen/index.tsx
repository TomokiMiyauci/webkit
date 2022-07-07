/** @jsx h */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../../components/Header.tsx";
import Main from "../../islands/Main.tsx";
import NavigationDrawer from "../../components/NavigationDrawer.tsx";
import Footer from "../../components/Footer.tsx";
import { NodesAndClassQuery } from "../../schemas/generated/graphql.ts";
import { tw } from "@twind";
import { handler as graphqlHandler } from "../graphql.ts";
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

      const variables = { hasType: has$Type, id: $type ?? "" };
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
    <Fragment>
      <Header
        class={tw
          `sticky top-0 backdrop-blur backdrop-filter border-b px-4 py-2`}
      />

      <section
        class={tw`grid h-full`}
      >
        <NavigationDrawer
          class={tw
            `border-r sticky h-full top-0 bg-gray-50 px-4 py-2 shadow hidden sm:hidden`}
        />

        <div class={tw`p-8`}>
          <Main
            nodes={data.schemaOrg.nodes}
            url={url.toString()}
            class={tw`container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8`}
          />

          <Footer class={tw`container mx-auto mt-20`} />
        </div>
      </section>
    </Fragment>
  );
}
