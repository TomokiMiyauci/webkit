import {
  ClassNode as ClassNodeSpec,
  DataTypeNode as DataTypeSpec,
  FieldValue,
  Node as NodeSpec,
  PropertyNode as PropertySpec,
} from "@/graphql_types.ts";
import {
  collectNodes,
  collectProperties,
  collectSubClass,
  isPending,
  resolveLanguage,
} from "@/utils/json_lds.ts";
import { marked } from "marked";
import { wrap } from "@/deps.ts";
import dataType from "@/data/data_type.json" assert { type: "json" };
import { RawNode, SchemaOrgTypes } from "@/types.ts";
import { distinctBy } from "std/collections/distinct_by.ts";

export type Props = { rawNode: RawNode };

type DataTypeType = typeof dataType;

export class Node implements NodeSpec {
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

export class PropertyNode extends Node implements PropertySpec {
  protected schemaOrg: SchemaOrgTypes;

  constructor(
    { rawNode, schemaOrg }: Readonly<Props & { schemaOrg: SchemaOrgTypes }>,
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
      const dataTypeNode = new DataTypeNode({ rawNode, dataType });
      const { name, id, types, description, field, isPending } = dataTypeNode;

      return { name, id, types, description, field, isPending };
    });

    return schemas;
  }
}

export class DataTypeNode extends Node implements DataTypeSpec {
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
    const value = this.dataTypeNode?.value;
    return value ? mapField(value) : "Unknown";
  }
}

const fields: string[] = [
  "URL",
  "Text",
  "Date",
  "DateTime",
  "Number",
  "Unknown",
];
function mapField(value: string): FieldValue {
  return fields.includes(value) ? value as FieldValue : "Unknown";
}

export class ClassNode extends Node implements ClassNodeSpec {
  protected schemaOrg: SchemaOrgTypes;
  constructor(
    { rawNode, schemaOrg }: Readonly<Props & { schemaOrg: SchemaOrgTypes }>,
  ) {
    super({ rawNode });
    this.schemaOrg = schemaOrg;
  }
  get properties() {
    const rootNode = this.rawNode;
    const schemaOrg = this.schemaOrg;
    const subClasses = collectSubClass(rootNode, schemaOrg);

    const propertyNodes = [rootNode, ...subClasses].map((node) => {
      return collectProperties(node, schemaOrg);
    }).flat();

    const cleanPropertyNodes = distinctBy(
      propertyNodes,
      (rawNode) => rawNode["@id"],
    );

    const properties = cleanPropertyNodes.map((node) => {
      const property = new PropertyNode({
        rawNode: node,
        schemaOrg: this.schemaOrg,
      });
      const { name, id, types, description, schemas, isPending } = property;
      return { name, id, types, description, schemas, isPending };
    });

    return properties;
  }
}
