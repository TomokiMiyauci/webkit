/** @jsx h */
import { Fragment, h } from "preact";
import { useCallback, useMemo, useState } from "preact/hooks";
import { apply, tw } from "@twind";
import Input from "@/components/Input.tsx";
import Required from "@/components/Required.tsx";
import { ClassQuery, RequireFields } from "@/schemas/generated/graphql.ts";

const card = apply
  `hover:bg-gray-100 hover:shadow p-3 rounded-md transition duration-300`;

export type Props = {
  options: { id: string; name: string }[];

  classNode: ClassQuery["schemaOrg"]["class"];

  onTypeChange: h.JSX.GenericEventHandler<HTMLSelectElement>;

  onInput: (value: string) => h.JSX.GenericEventHandler<HTMLInputElement>;

  type: string;

  formData: Record<string, string>;
};

export default function Form(
  { options, classNode, onTypeChange, type, formData, onInput }: Readonly<
    Props
  >,
): h.JSX.Element {
  const handleSubmit = useCallback((ev: Event) => {
    ev.preventDefault();
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
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
            onChange={onTypeChange}
            class={tw
              `border rounded p-1 shadow cursor-pointer focus:outline-none focus:ring transition duration-300 w-full`}
            required
            id="form-0-type"
          >
            <option value="" selected disabled>
              Select type
            </option>
            {options.map(({ id, name }) => {
              return <option key={id} value={id}>{name}</option>;
            })}
          </select>
        </li>

        {classNode?.properties.map((fieldData) => (
          <li class={tw(card)}>
            <Field {...fieldData} onInput={onInput} formData={formData} />
          </li>
        ))}
      </ul>
    </form>
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
  Text: (props) => <Input placeholder="Enter text" {...props} />,
  Number: (props) => (
    <Input type="number" placeholder="Enter number" min={0} {...props} />
  ),
};

type FieldProps =
  & RequireFields<
    ClassQuery["schemaOrg"],
    "class"
  >["class"]["properties"][number]
  & {
    onInput: (value: string) => h.JSX.GenericEventHandler<HTMLInputElement>;

    formData: Record<string, string>;
  };

function Field(
  { name, description, schemas, formData, onInput }: Readonly<
    FieldProps
  >,
): h.JSX.Element {
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
    <Fragment>
      <div class={tw`flex justify-between`}>
        <label for={id} class={tw`cursor-auto text-2xl`}>
          {name}
        </label>
      </div>

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
                  onInput={(ev) => setDataType(ev.currentTarget.value)}
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
        onInput: onInput(name),
        id,
        value: formData[name],
      })}
    </Fragment>
  );
}
