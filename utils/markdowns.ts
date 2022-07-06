import { marked } from "https://esm.sh/marked";
import { isAbsolute } from "std/path/mod.ts";

type MarkedExtension = Parameters<typeof marked.use>[number];

const renderer = new marked.Renderer();
const DOC_BASE_URL = "https://schema.org";
renderer.link = (href, _, text) => {
  href = href ?? "";
  href = isAbsolute(href) ? new URL(href, DOC_BASE_URL).toString() : href;
  return `<a target="_blank" href="${href}">${text}</a>`;
};

export const extension: MarkedExtension = {
  breaks: true,
  baseUrl: "https://schema.org",
  renderer,
  tokenizer: {
    link(src) {
      const match = src.match(/^\[\[(.+?)\]\]/);

      if (match) {
        return {
          type: "link",
          raw: match[0],
          text: match[1],
          href: `/${match[1]}`,
          title: "",
          tokens: [
            {
              type: "text",
              raw: match[1],
              text: match[1],
            },
          ],
        };
      }

      return false;
    },
  },
};
