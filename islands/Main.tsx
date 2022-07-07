/** @jsx h */
import { Fragment, h } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { apply, tw } from "@twind";
import Preview from "./Preview.tsx";
import Required from "@/components/Required.tsx";
import { Class, Maybe, Query, SchemaOrg } from "@/schemas/generated/graphql.ts";
import { Result } from "@/schemas/types.ts";
import { gql } from "@/utils/gqls.ts";
import Input from "@/components/Input.tsx";
import { filterKeys } from "std/collections/filter_keys.ts";

export type Props =
  & Pick<SchemaOrg, "nodes">
  & { url: string }
  & h.JSX.IntrinsicElements["main"];

const query = gql`query Query($id: String) {
  schemaOrg {
    class(id: $id) {
      name
      description
      properties {
        name
        description
        schemas {
          name
          field
        }
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

export default function Main({ nodes, url, ...props }: Readonly<Props>) {
  const _url = useMemo<URL>(() => new URL(url), [url]);

  const [properties, setProperties] = useState<Record<string, string>>(() => {
    const record: Record<string, string> = {};
    _url.searchParams.forEach((value, key) => {
      if (key !== "@type") {
        record[key] = value;
      }
    });

    return record;
  });

  const [invalidNames, setInvalidNames] = useState<string[]>([]);

  const [cls, setClass] = useState<Maybe<Class>>();

  const [type, setType] = useState<string>(() => {
    const type = _url.searchParams.get("@type");

    return type ?? "";
  });
  const data = useMemo<Record<string, string>>(
    () => ({ ...properties, ["@type"]: type }),
    [properties, type],
  );

  const dataWithoutInvalidField = useMemo<Record<string, string>>(
    () => filterKeys(data, (key) => !invalidNames.includes(key)),
    [data, invalidNames],
  );
  const handleInput = useCallback<
    (value: string) => h.JSX.GenericEventHandler<HTMLInputElement>
  >((name) =>
    (ev) => {
      const isValid = ev.currentTarget.reportValidity();
      setProperties((data) => ({
        ...data,
        [name]: ev.currentTarget.value,
      }));
      if (isValid) {
        setInvalidNames((data) => {
          const set = new Set(data);
          set.delete(name);
          return [...set];
        });
      } else {
        setInvalidNames((data) => [...new Set(data).add(name)]);
      }
    }, []);

  useEffect(() => {
    const entries = Object.entries(data);
    if (!entries.length) return;

    const url = new URL(location.href);

    entries.forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    window.history.replaceState(null, "", url);
  }, [data]);

  const dataSet = useMemo<Record<string, string>>(
    () => ({ ...base, "@type": type, ...dataWithoutInvalidField }),
    [
      base,
      type,
      dataWithoutInvalidField,
    ],
  );

  useEffect(() => {
    if (!type) return;

    const url = new URL("/graphql", location.href);
    url.searchParams.set("query", query);
    url.searchParams.set("variables", JSON.stringify({ id: type }));

    fetch(url).then(async (res) => {
      if (res.ok) {
        const result = await res.json() as Result<Query>;
        setClass(result.data.schemaOrg.class);
      } else {
        console.log(res);
      }
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

            {cls?.properties.map(({ name, description, schemas }) => {
              const id = useMemo<string>(
                () => `form-0-${name.toLowerCase()}`,
                [name],
              );
              const isOnlyField = useMemo<boolean>(() => schemas.length === 1, [
                schemas,
              ]);
              const [dataType, setDataType] = useState<string | undefined>(
                () => {
                  if (isOnlyField) {
                    const schema = schemas[0];
                    return schema.name;
                  }
                },
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

                  {!isOnlyField && (
                    <fieldset>
                      <legend>Data Type</legend>

                      {schemas.map(({ field, name: dataTypeName }) => {
                        const id = useMemo<string>(
                          () => `${name}-${dataTypeName}`,
                          [name, dataTypeName],
                        );
                        return (
                          <Fragment>
                            <input
                              id={id}
                              value={field}
                              checked={dataType === field}
                              onInput={(ev) =>
                                setDataType(ev.currentTarget.value)}
                              type="radio"
                            />
                            <label for={id}>
                              {dataTypeName}
                            </label>
                          </Fragment>
                        );
                      })}
                    </fieldset>
                  )}

                  {dataType && makeInput(dataType)({
                    onInput: handleInput(name),
                    id,
                    value: data[name],
                  })}
                </li>
              );
            })}
          </ul>
        </form>
      </section>

      <section class={tw`self-start sticky top-16`}>
        <h1 class={tw`text-3xl mb-4 py-2`}>Preview</h1>
        <Preview data={dataSet} />
      </section>
    </main>
  );
}

function makeInput(value: string) {
  const component = dataTypeInputMap[value] ??
    (() => <p class={tw`text-red-500`}>This field is not supported now.</p>);

  return component;
}

const dataTypeInputMap: Record<
  string,
  (props: h.JSX.IntrinsicElements["input"]) => h.JSX.Element
> = {
  URL: (props) => (
    <Input
      {...props}
      autocomplete="url"
      placeholder={`Enter URL format`}
      type="url"
    />
  ),
  Text: (props) => <Input placeholder="Enter any text" {...props} />,
};
