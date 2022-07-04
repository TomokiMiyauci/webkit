/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

export default function Required(): h.JSX.Element {
  return (
    <abbr
      class={tw
        `rounded-full border inline-flex items-center align-middle bg-red-500 px-2 text-sm py-0.5 text-white border-red-600 no-underline!`}
      title="required"
      aria-label="required"
    >
      Required
    </abbr>
  );
}
