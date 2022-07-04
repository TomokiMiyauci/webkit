/** @jsx h */
import { h, JSX } from "preact";
import { useCallback, useMemo } from "preact/hooks";
import { tw } from "@twind";
import { filterValues } from "../deps.ts";
import { jsonObject } from "../types/data.ts";

export type Props = {
  data: jsonObject;
};

export default function Preview({ data }: Readonly<Props>): h.JSX.Element {
  const formatted = useMemo<string>(
    () => JSON.stringify({ ...filterValues(data, Boolean) }, null, 2),
    [data],
  );

  const handleClick = useCallback<JSX.MouseEventHandler<EventTarget>>(() => {
    navigator.clipboard.writeText(formatted);
  }, [formatted]);

  return (
    <pre class={tw`relative`}>
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
