import {
  Class,
  DataTypeNode,
  FieldValue,
  Node,
  Property,
} from "@/graphql_types.ts";
import {
  collectNodes,
  collectProperties,
  collectSubClass,
  isPending,
  RawNode,
  resolveLanguage,
  SchemaOrg,
} from "@/utils/json_lds.ts";
import { marked } from "marked";
import { wrap } from "@/deps.ts";
import dataType from "@/data/data_type.json" assert { type: "json" };

type FieldValueAsString = Exclude<keyof typeof FieldValue, "Url"> | "URL";

export type Props = { rawNode: RawNode };

type DataTypeType = typeof dataType;

export class NodeClass implements Node {
  protected rawNode: RawNode;

  constructor({ rawNode }: Readonly<Props>) {
    this.rawNode = rawNode;
  }

  get id() {
    return this.rawNode["@id"];
  }

  get description() {
    const description = marked(
      resolveLanguage(this.rawNode["rdfs:comment"]).replaceAll("\n\n", "\n"),
    );
    return description;
  }

  get name() {
    const name = resolveLanguage(this.rawNode["rdfs:label"]);
    return name;
  }

  get types() {
    const types = wrap(this.rawNode["@type"]);

    return types;
  }

  get isPending() {
    const isPartOf = this.rawNode["schema:isPartOf"];

    return isPending(isPartOf?.["@id"]);
  }
}

export class PropertyClass extends NodeClass implements Property {
  protected schemaOrg: SchemaOrg;

  constructor(
    { rawNode, schemaOrg }: Readonly<Props & { schemaOrg: SchemaOrg }>,
  ) {
    super({ rawNode });
    this.schemaOrg = schemaOrg;
  }
  get schemas() {
    const subClasses = collectNodes(
      this.rawNode,
      "schema:rangeIncludes",
      this.schemaOrg["@graph"],
    );

    const schemas = subClasses.map((rawNode) => {
      const dataTypeNode = new DataType({ rawNode, dataType });
      const { name, id, types, description, field, isPending } = dataTypeNode;

      return { name, id, types, description, field, isPending };
    });

    return schemas;
  }
}

export class DataType extends NodeClass implements DataTypeNode {
  protected dataType: DataTypeType;

  protected dataTypeNode: { "@id": string; value: string } | undefined;

  constructor(
    { rawNode, dataType }: Readonly<Props & { dataType: DataTypeType }>,
  ) {
    super({ rawNode });
    this.dataType = dataType;

    const id = rawNode["@id"];
    const graph = dataType["@graph"];
    const dataTypeNode = graph.find((node) => node["@id"] === id);
    if (!dataTypeNode) {
      return;
    }

    this.dataTypeNode = {
      "@id": dataTypeNode["@id"],
      value: dataTypeNode.value["@value"],
    };
  }

  get isDataType(): boolean {
    return !!this.dataTypeNode;
  }

  get field() {
    return mapFieldValue(this.dataTypeNode?.value ?? "Unknown");
  }
}

function mapFieldValue(value: string): FieldValue {
  if (value in valueFieldValueMap) {
    return valueFieldValueMap[value as FieldValueAsString];
  }
  return FieldValue.Unknown;
}

const valueFieldValueMap: Record<FieldValueAsString, FieldValue> = {
  Text: FieldValue.Text,
  URL: FieldValue.Url,
  Unknown: FieldValue.Unknown,
  Number: FieldValue.Number,
  Date: FieldValue.Date,
  DateTime: FieldValue.DateTime,
};

export class ClassClass extends NodeClass implements Class {
  protected schemaOrg: SchemaOrg;
  constructor(
    { rawNode, schemaOrg }: Readonly<Props & { schemaOrg: SchemaOrg }>,
  ) {
    super({ rawNode });
    this.schemaOrg = schemaOrg;
  }
  get properties() {
    const id = this.rawNode["@id"];
    const schemaOrg = this.schemaOrg;
    const subClasses = collectSubClass(id, schemaOrg);

    const propertyNodes = subClasses.map((node) => {
      return collectProperties(node["@id"], schemaOrg);
    }).flat();

    const properties = propertyNodes.map((node) => {
      const property = new PropertyClass({
        rawNode: node,
        schemaOrg: this.schemaOrg,
      });
      const { name, id, types, description, schemas, isPending } = property;
      return { name, id, types, description, schemas, isPending };
    });

    return properties;
  }
}
