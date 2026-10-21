import { describe, expect, it } from "vitest";
import { shareValue } from "./floor";

describe("fractional slice", () => {
  it("divides and keeps the remainder", () => {
    expect(shareValue(100_000_000n, 1n, 4n)).toEqual({ ok: true, value: 25_000_000n, remainder: 0n });
    expect(shareValue(10n, 1n, 3n)).toEqual({ ok: true, value: 3n, remainder: 1n });
    expect(shareValue(10n, 4n, 3n).ok).toBe(false);
  });
});
