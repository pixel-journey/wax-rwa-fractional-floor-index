import type { SliceOk } from "./floor";

export function exportSliceMarkdown(
  wholePrice: string,
  held: string,
  supply: string,
  s: SliceOk
): string {
  return [
    "# Fractional share value (educational)",
    "",
    "> Not a live RWA index. Integer floor only.",
    "",
    `wholePrice: ${wholePrice}`,
    `held: ${held}`,
    `supply: ${supply}`,
    "",
    `value: ${s.value.toString()}`,
    `remainder: ${s.remainder.toString()}`,
    `product: ${s.product.toString()}`,
    `exact: ${s.exact}`,
    "",
  ].join("\n");
}

export function downloadText(filename: string, content: string): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
