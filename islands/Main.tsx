/** @jsx h */
import { h } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { apply, tw } from "@twind";
import Preview from "./Preview.tsx";
import { ClassProps, Data } from "../types/data.ts";
import Required from "../components/Required.tsx";
import { fetchClassProperties } from "../utils/json_ld_client.ts";
import { Summary } from "../utils/json_ld_convert.ts";

export type Props = ClassProps & h.JSX.IntrinsicElements["main"];

const base = {
  "@context": "https://schema.org",
};

const card = apply
  `hover:bg-gray-100 hover:shadow p-3 rounded-md transition duration-300`;

export default function Main({ classes, ...props }: Props) {
  const [data, setData] = useState<Data>({});
  const [properties, setProperties] = useState<Summary[]>([]);

  const [type, setType] = useState<string>("");
  const classNames = useMemo<string[]>(
    () => classes.map(({ name }) => name),
    [],
  );
  const dataSet = useMemo(() => ({ ...base, "@type": type, ...data }), [
    base,
    type,
    data,
  ]);

  useEffect(() => {
    if (!type) return;

    fetchClassProperties({ type }, {
      baseURL: window.location.href,
    }).then((result) => {
      setProperties(result.properties);
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
                {classNames.map((cls) => {
                  return <option key={cls} value={cls}>{cls}</option>;
                })}
              </select>
            </li>

            {properties.map(({ name, description }) => {
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

                  <p class={tw`mb-3 flex-1`}>{description}</p>

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
