import { constructClass } from "./json_ld_convert.ts";
import { assertEquals, assertSnapshot, describe, it } from "../dev_deps.ts";

const jsonLd = {
  "@context": {},
  "@graph": [
    {
      "@id": "schema:Intangible",
      "@type": "rdfs:Class",
      "rdfs:comment":
        "A utility class that serves as the umbrella for a number of 'intangible' things such as quantities, structured values, etc.",
      "rdfs:label": "Intangible",
      "rdfs:subClassOf": {
        "@id": "schema:Thing",
      },
    },
    {
      "@id": "schema:Thing",
      "@type": "rdfs:Class",
      "rdfs:comment": "The most generic type of item.",
      "rdfs:label": "Thing",
    },
  ],
};

const describeDefinition = describe("constructClass");

it(describeDefinition, "should return undefined when it has not class", () => {
  assertEquals(constructClass("test", jsonLd), undefined);
});

it(describeDefinition, "should return undefined when it has not class", (t) => {
  assertSnapshot(t, constructClass("Intangible", jsonLd));
});
