/** @jsx h */
import { Fragment, h } from "preact";
import { tw } from "@twind";
import Header from "../components/Header.tsx";
import Footer from "../components/Footer.tsx";

export default function Page(): h.JSX.Element {
  const container = tw`container mx-auto`;

  return (
    <Fragment>
      <Header innerClass={container} />

      <section class={tw`bg-gray-50 border-b`}>
        <header class={tw`${container} text-center`}>
          <h1 class={tw`text-5xl p-8`}>Webkit</h1>

          <p class={tw`text-xl p-8`}>A utility toolkit on Web</p>
        </header>
      </section>

      <main class={tw`${container} my-10`}>
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
