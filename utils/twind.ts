import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup } from "twind";
import { apply, css } from "twind/css";
export * from "twind";
export const config: Configuration = {
  darkMode: "class",
  mode: "silent",
  preflight: (preflight) =>
    css(
      preflight,
      {
        body: apply`text-gray-800 antialiased`,
      },
    ),
};
if (IS_BROWSER) setup(config);
