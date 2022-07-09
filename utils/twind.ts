import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
import { apply, css } from "twind/css";
import { lineClamp } from "@twind/line-clamp";
import typography from "@twind/typography";
export * from "twind";
export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
  preflight: (preflight) =>
    css(
      preflight,
      {
        body: apply`text-gray-800 antialiased`,
        ".md-root": apply`prose`,
      },
    ),
  plugins: {
    /** for avoid twind bug */
    "grid-rows-auto-1": {
      "grid-template-rows": "auto 1fr",
    },
    "grid-cols-auto-1": {
      "grid-template-columns": "auto 1fr",
    },
    "grid-rows-auto-auto-1": {
      "grid-template-rows": "auto auto 1fr",
    },
    "grid-rows-1-auto": {
      "grid-template-rows": "1fr auto",
    },
    "line-clamp": lineClamp,
    ...typography(),
  },
};
if (IS_BROWSER) setup(config);
