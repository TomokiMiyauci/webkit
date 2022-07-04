/** @jsx h */
import { Fragment, h } from "preact";
import { apply, tw } from "@twind";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";
import Hero from "../components/Hero.tsx";

const container = apply`container mx-auto`;

export default function Page(): h.JSX.Element {
  return (
    <Fragment>
      <Header
        class={tw
          `sticky top-0 backdrop-blur backdrop-filter border-b px-4 py-2`}
        innerClass={tw(container)}
      />

      <Hero class={tw`bg-gray-50 border-b`} />

      <main class={tw`${container} my-10 p-5 sm:p-0`}>
        <h1 class={tw`text-2xl my-4`}>Tools</h1>

        <nav>
          <ul>
            <li>
              <a
                class={tw
                  `border inline-flex flex-col rounded-md p-4 shadow hover:shadow-md transition`}
                href="/schema-org-gen"
              >
                <h1 class={tw`text-xl`}>
                  Schema.org generator
                </h1>

                <p>A online schema.org generator</p>
              </a>
            </li>
          </ul>
        </nav>
      </main>

      <Footer class={tw`bg-gray-50 border mt-96`} />
    </Fragment>
  );
}
