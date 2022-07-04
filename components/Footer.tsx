/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export type Props = {
  innerClass: string;
} & h.JSX.IntrinsicElements["footer"];

export default function Footer(
  { innerClass = tw`container mx-auto`, ...props }: Readonly<Partial<Props>>,
): h.JSX.Element {
  return (
    <footer {...props}>
      <div class={innerClass}>
        <small>
          Created by

          <a
            class={tw`ml-1`}
            href="https://github.com/TomokiMiyauci"
            target="_blank"
          >
            TomokiMiyauci
          </a>
        </small>
      </div>
    </footer>
  );
}
