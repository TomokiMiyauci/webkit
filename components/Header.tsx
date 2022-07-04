/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export type Props = {
  innerClass: string;
};

export default function Header(
  { innerClass }: Readonly<Partial<Props>>,
): h.JSX.Element {
  return (
    <header class={tw`border-b px-4 py-2`}>
      <div class={innerClass}>
        <a href="/" class={tw`text-3xl`}>Webkit</a>
      </div>
    </header>
  );
}
