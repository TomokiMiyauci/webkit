import { Class } from "./json_ld_convert.ts";

export type Params = {
  type: string;
};

export async function fetchClassProperties(
  { type }: Readonly<Params>,
  { baseURL }: { baseURL: string },
): Promise<Class> {
  const url = new URL("api/class", baseURL);
  url.searchParams.append("@id", `schema:${type}`);

  const res = await fetch(url);
  const json = await res.json() as Class;

  return json;
}
