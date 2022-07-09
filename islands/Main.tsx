/** @jsx h */
import { h } from "preact";
import { useCallback, useEffect, useMemo, useState } from "preact/hooks";
import { tw } from "@twind";
import Preview from "@/islands/Preview.tsx";
import { ClassNodeQuery, NodesAndClassNodeQuery } from "@/graphql_types.ts";
import { fetchGql, gql } from "@/utils/gqls.ts";
import { filterKeys } from "std/collections/filter_keys.ts";
import Form from "@/islands/Form.tsx";
import useIsFirstMount from "atomic-ui@preact/hooks/use_is_first_mount.ts";

export type Props =
  & NodesAndClassNodeQuery
  & { url: string }
  & h.JSX.IntrinsicElements["main"];

const query = gql`query ClassNode($id: String!) {
  schemaOrg {
    classNode(id: $id) {
      name
      description
      properties(orderBy: [{ key: "isPending", by: ASC }, {key: "name", by: ASC}]) {
        name
        description
        schemas {
          name
          field
        }
        isPending
      }
    }
  }
}
`;

const base = {
  "@context": "https://schema.org",
};

export default function Main(
  { schemaOrg: { nodes, classNode: initialClassNode }, url, ...props }:
    Readonly<Props>,
) {
  const _url = useMemo<URL>(() => new URL(url), [url]);

  const isFirstMount = useIsFirstMount();

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

  const [classNode, setClassNode] = useState<
    ClassNodeQuery["schemaOrg"]["classNode"]
  >(
    initialClassNode,
  );

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
    if (!type || isFirstMount) return;

    const url = new URL("/graphql", location.href);
    fetchGql<ClassNodeQuery>({
      endpoint: url,
      query,
    }, {
      variables: { id: type },
    }).then(({ schemaOrg }) => {
      setClassNode(schemaOrg.classNode);
    }).catch((e) => {
      console.log(e);
    });
  }, [type]);

  return (
    <main {...props}>
      <section class={tw`overflow-y-auto`}>
        <h1 class={tw`text-3xl p-2`}>Form</h1>

        <Form
          type={type}
          onTypeChange={(ev) => {
            setType(ev.currentTarget.value);
          }}
          formData={data}
          options={nodes}
          classNode={classNode}
          onInput={handleInput}
        />
      </section>

      <section class={tw`overflow-hidden`}>
        <h1 class={tw`text-3xl mb-4 py-2`}>Preview</h1>
        <Preview data={dataSet} />
      </section>
    </main>
  );
}
