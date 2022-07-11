/** @jsx h */
import { h, JSX } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import { tw } from "@twind";
import { filterValues, jsonObject } from "../deps.ts";
import { stringify } from "pure_json/mod.ts";

export type Props = {
  data: jsonObject;
};

export default function Preview({ data }: Readonly<Props>): h.JSX.Element {
  const formatted = useMemo<string>(
    () => {
      const result = stringify({ ...filterValues(data, Boolean) }, null, 2);
      return result[1] ? "" : result[0];
    },
    [data],
  );

  const handleClick = useCallback<JSX.MouseEventHandler<EventTarget>>(() => {
    navigator.clipboard.writeText(formatted);
  }, [formatted]);

  return (
    <pre class={tw`relative overflow-scroll`}>
      <code>
        {formatted}
      </code>

      <button
        onClick={handleClick}
        class={tw
          `absolute right-0 top-0 focus:outline-none focus:ring transition duration-300 rounded p-1`}
        type="button"
      >
        Copy
      </button>
    </pre>
  );
}
