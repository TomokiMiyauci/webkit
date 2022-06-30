/** @jsx h */
import { h } from "preact";
import { useMemo } from "preact/hooks";
import { tw } from "@twind";
import { filterValues } from "../deps.ts";
import { jsonObject } from "../types/data.ts";

const base = {
  "@context": "https://schema.org",
};

export type Props = {
  data: jsonObject;
};

export default function Preview({ data }: Readonly<Props>): h.JSX.Element {
  const formatted = useMemo<string>(
    () => JSON.stringify({ ...base, ...filterValues(data, Boolean) }, null, 2),
    [data],
  );

  return (
    <pre class={tw`relative`}>
      <code>
        {formatted}
      </code>

      <button
        onClick={() => {
          navigator.clipboard.writeText(formatted);
        }}
        class={tw
          `absolute right-0 top-0 focus:outline-none focus:ring transition duration-300 rounded p-1`}
        type="button"
      >
        Copy
      </button>
    </pre>
  );
}
