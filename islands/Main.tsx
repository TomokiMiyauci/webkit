/** @jsx h */
import { h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { apply, tw } from "@twind";
import Preview from "./Preview.tsx";
import Required from "../components/Required.tsx";
import {
  Class,
  Maybe,
  Query,
  SchemaOrg,
} from "../schemas/generated/graphql.ts";
import { Result } from "../schemas/types.ts";
import { gql } from "../utils/gqls.ts";

export type Props = SchemaOrg & h.JSX.IntrinsicElements["main"];

const query = gql`query Query($id: String) {
  schemaOrg {
    class(id: $id) {
      name
      description
      properties {
        name
        description
      }
    }
  }
}
`;

const base = {
  "@context": "https://schema.org",
};

const card = apply
  `hover:bg-gray-100 hover:shadow p-3 rounded-md transition duration-300`;

export default function Main({ nodes, ...props }: Readonly<Props>) {
  const [data, setData] = useState<Record<string, string>>({});
  const [cls, setClass] = useState<Maybe<Class>>();

  const [type, setType] = useState<string>("");

  const dataSet = useMemo(() => ({ ...base, "@type": type, ...data }), [
    base,
    type,
    data,
  ]);

  useEffect(() => {
    if (!type) return;

    const url = new URL("/graphql", location.href);
    url.searchParams.set("query", query);
    url.searchParams.set("variables", JSON.stringify({ id: type }));

    fetch(url).then(async (res) => {
      const result = await res.json() as Result<Query>;
      setClass(result.data.schemaOrg.class);
    });
  }, [type]);

  return (
    <main {...props}>
      <section>
        <h1 class={tw`text-3xl p-2`}>Form</h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <ul class={tw`space-y-4 sm:grid-cols-2 gap-4`}>
            <li class={tw(card)}>
              <div class={tw`flex justify-between`}>
                <label for="form-0-type" class={tw`text-2xl`}>
                  Type
                </label>

                <Required />
              </div>
              <p class={tw`mb-3`}>A type of Schema</p>

              <select
                value={type}
                onChange={(e) => {
                  setType(e.currentTarget.value);
                }}
                class={tw
                  `border rounded p-1 shadow cursor-pointer focus:outline-none focus:ring transition duration-300 w-full`}
                required
                id="form-0-type"
              >
                <option value="" selected disabled>
                  Select type
                </option>
                {nodes.map(({ id, name }) => {
                  return <option key={id} value={id}>{name}</option>;
                })}
              </select>
            </li>

            {cls?.properties.map(({ name, description }) => {
              const id = useMemo<string>(
                () => `form-0-${name.toLowerCase()}`,
                [name],
              );

              return (
                <li
                  class={tw(card, "flex flex-col")}
                  key={name}
                >
                  <label for={id} class={tw`cursor-auto text-2xl`}>
                    {name}
                  </label>

                  <p
                    dangerouslySetInnerHTML={{
                      __html: description,
                    }}
                    class={tw`mb-3 flex-1`}
                  />

                  <input
                    class={tw
                      `shadow rounded border focus:outline-none focus:ring transition duration-300 px-2 py-0.5 w-full`}
                    onInput={(e) => {
                      setData((data) => ({
                        ...data,
                        [name]: e.currentTarget.value,
                      }));
                    }}
                    placeholder={`Enter ${name}`}
                    type="text"
                    id={id}
                  />
                </li>
              );
            })}
          </ul>
        </form>
      </section>

      <section>
        <h1 class={tw`text-3xl mb-4 py-2`}>Preview</h1>
        <Preview data={dataSet} />
      </section>
    </main>
  );
}
