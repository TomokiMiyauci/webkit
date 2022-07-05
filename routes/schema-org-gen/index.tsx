/** @jsx h */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../../components/Header.tsx";
import Main from "../../islands/Main.tsx";
import NavigationDrawer from "../../components/NavigationDrawer.tsx";
import Footer from "../../components/Footer.tsx";
import { Result } from "../../schemas/types.ts";
import { Query } from "../../schemas/generated/graphql.ts";
import { tw } from "@twind";

const query = `query {
  schemaOrg {
    nodes(type: CLASS) {
      id
      name
    }
  }
}`;

const MEDIA_TYPE = "application/json";

export const handler: Handlers<Result<Query>["data"]> = {
  async GET(req, ctx) {
    try {
      const graphqlUrl = new URL("/graphql", req.url);
      graphqlUrl.searchParams.set("query", query);

      const res = await fetch(graphqlUrl, {
        headers: {
          Accept: MEDIA_TYPE,
        },
      });

      if (res.ok) {
        const { data, errors } = await res.json() as Result<Query>;
        if (errors) {
          return new Response(JSON.stringify(errors), {
            headers: {
              "Content-Type": MEDIA_TYPE,
            },
          });
        }

        return ctx.render(data);
      } else {
        return res;
      }
    } catch (e) {
      const msg = e instanceof Error
        ? e.message
        : "Unknown error has occurred.";
      return new Response(msg, {
        status: 500,
      });
    }
  },
};

export default function Home(
  { data }: Readonly<PageProps<Result<Query>["data"]>>,
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
            class={tw`container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8`}
          />

          <Footer class={tw`container mx-auto mt-20`} />
        </div>
      </section>
    </Fragment>
  );
}
