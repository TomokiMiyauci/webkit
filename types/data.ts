export interface Schema {
  name: string;
  dataType: "string";

  description: string;
}

export type Schemas = Iterable<Schema>;

export type Data = Record<string, string>;

export interface Class {
  name: string;
}

export type ClassProps = {
  classes: Class[];
};

export type json = string | number | null | boolean | json[] | jsonObject;

export type jsonObject = {
  [k: string]: json;
};
