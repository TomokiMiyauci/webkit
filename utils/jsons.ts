/** Types for JSON with JavaScript Object */
export type json =
  | string
  | number
  | boolean
  | null
  | { [k: string]: json }
  | json[];

/** Safe converts a JavaScript Object Notation (JSON) string into an object.
 * It does not throw errors compared to `JSON.parse`.
 * @param text A valid JSON string.
 * @param reviver A function that transforms the results. This function is called for each member of the object. If a member contains nested objects, the nested objects are transformed before the parent object is.
 */
export function jsonParse(
  text: string,
  reviver?: Parameters<typeof JSON.parse>[1],
): [valid: false, error: SyntaxError] | [valid: true, data: json] {
  try {
    const result = JSON.parse(text, reviver) as json;
    return [true, result];
  } catch (e) {
    return [false, e as SyntaxError];
  }
}

/** Safe converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 * @param value A JavaScript value, usually an object or array, to be converted.
 * @param replacer An array of strings and numbers that acts as an approved list for selecting the object properties that will be stringified.
 * @param space Adds indentation, white space, and line break characters to the return-value JSON text to make it easier to read.
 */
export function jsonStringify(
  value: unknown,
  replacer?: (number | string)[] | null,
  space?: string | number,
): [valid: false, error: TypeError] | [valid: true, data: string] {
  try {
    const result = JSON.stringify(value, replacer, space);
    return [true, result];
  } catch (e) {
    return [false, e as TypeError];
  }
}
