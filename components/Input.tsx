/** @jsx h */
import { h } from "preact";
import { defineDefault, lazy } from "@/utils/default.ts";
import { tw } from "@twind";
import { mergeClassName } from "@/utils/classnames.ts";

function Input<P extends h.JSX.IntrinsicElements["input"]>(
  props: P,
): h.JSX.Element {
  return <input {...props} />;
}

const BaseInput = lazy(() =>
  defineDefault(Input, {
    args: [{
      "class": tw
        `rounded border focus:outline-none focus:ring transition duration-300 px-2 py-0.5 w-full`,
    }],
    merge: ({ class: classA, ...restA }, { class: classB, ...restB }) => {
      return {
        ...restA,
        ...restB,
        class: mergeClassName(classA, classB),
      };
    },
  })
);

export default BaseInput;
