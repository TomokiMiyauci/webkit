import schemaOrg from "@/data/schema.json" assert { type: "json" };

export type SchemaOrgTypes = typeof schemaOrg;

export type RawNode = SchemaOrgTypes["@graph"][number];
