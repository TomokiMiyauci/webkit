/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export type Props = h.JSX.IntrinsicElements["section"];

export default function Hero({ ...props }: Readonly<Props>) {
  return (
    <section {...props}>
      <header class={tw`container mx-auto text-center`}>
        <h1 class={tw`text-5xl p-8`}>Webkit</h1>

        <p class={tw`text-xl p-8`}>A utility toolkit on Web</p>
      </header>
    </section>
  );
}
