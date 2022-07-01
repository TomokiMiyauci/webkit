/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export default function Header(): h.JSX.Element {
  return (
    <header class={tw`border-b px-4 py-2`}>
      <a href="/" class={tw`text-3xl`}>Webkit</a>
    </header>
  );
}
