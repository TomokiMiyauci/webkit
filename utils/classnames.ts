import { filterTruthy } from "@/deps.ts";

export function mergeClassName(
  a: string | undefined,
  b: string | undefined,
): string {
  const tokens = (a ?? "").split(" ").concat((b ?? "").split(" "));
  const tokenSet = new Set<string>(filterTruthy(tokens));

  return Array.from(tokenSet).join(" ");
}
