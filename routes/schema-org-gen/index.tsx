/** @jsx h */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import Header from "../../components/Header.tsx";
import Main from "../../islands/Main.tsx";
import NavigationDrawer from "../../components/NavigationDrawer.tsx";
import Footer from "../../components/Footer.tsx";
import { isString } from "../../deps.ts";
import schema from "../../data/schema.json" assert { "type": "json" };

import { Class, ClassProps } from "../../types/data.ts";
import { tw } from "@twind";

export const handler: Handlers<ClassProps> = {
  GET(req, ctx) {
    try {
      const graph = schema["@graph"];

      const classes = graph.filter((g) => {
        const type = g["@type"];
        return isString(type) && type === "rdfs:Class";
      }).map(({ "rdfs:label": name }) => ({ name })).slice(0, 4);

      return ctx.render({ classes });
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
  { data }: Readonly<PageProps<ClassProps>>,
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
            class={tw`container mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8`}
            classes={data.classes}
          />

          <Footer class={tw`container mx-auto mt-20`} />
        </div>
      </section>
    </Fragment>
  );
}
