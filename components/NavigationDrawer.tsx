/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export default function NavigationDrawer(): h.JSX.Element {
  return (
    <aside class={tw`w-72 border-r bg-gray-50 px-4 py-2 shadow`}>
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
