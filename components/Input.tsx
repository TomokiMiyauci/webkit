/** @jsx h */
import { h } from "preact";
import { defineDefault, lazy } from "@/utils/default.ts";
import { tw } from "@twind";

function Input<P extends h.JSX.IntrinsicElements["input"]>(
  props: P,
): h.JSX.Element {
  return <input {...props} />;
}

const BaseInput = lazy(() =>
  defineDefault(Input, {
    class: tw
      `rounded border focus:outline-none focus:ring transition duration-300 px-2 py-0.5 w-full`,
  })
);

export default BaseInput;
