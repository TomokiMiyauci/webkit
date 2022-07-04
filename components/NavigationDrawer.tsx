/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export type Props = h.JSX.IntrinsicElements["aside"];

export default function NavigationDrawer(
  { ...props }: Readonly<Props>,
): h.JSX.Element {
  return (
    <aside {...props}>
      <h1 class={tw`text-lg text-gray-500 mb-2`}>Tools</h1>

      <nav>
        <ul>
          <li>
            <a class={tw`block`} href="/schema-org-gen">Schema.org generator</a>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
