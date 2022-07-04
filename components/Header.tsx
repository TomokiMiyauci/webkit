/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export type Props = {
  innerClass: string;
} & h.JSX.IntrinsicElements["header"];

export default function Header(
  { innerClass, ...props }: Readonly<Partial<Props>>,
): h.JSX.Element {
  return (
    <header {...props}>
      <div class={innerClass}>
        <a href="/" class={tw`text-2xl`}>Webkit</a>
      </div>
    </header>
  );
}
