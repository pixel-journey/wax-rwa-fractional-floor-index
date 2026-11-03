import { describe, expect, it } from "vitest";
import {
  assertSliceInvariants,
  comparePrices,
  ownershipBps,
  shareValue,
  sumHolderFloors,
} from "./floor";

describe("shareValue", () => {
  it("divides evenly", () => {
    const s = shareValue(100_000_000n, 1n, 4n);
    expect(s).toEqual({
      ok: true,
      value: 25_000_000n,
      remainder: 0n,
      product: 100_000_000n,
      exact: true,
    });
    if (s.ok) assertSliceInvariants(100_000_000n, 1n, 4n, s);
  });

  it("keeps remainder", () => {
    const s = shareValue(10n, 1n, 3n);
    expect(s).toEqual({
      ok: true,
      value: 3n,
      remainder: 1n,
      product: 10n,
      exact: false,
    });
    if (s.ok) assertSliceInvariants(10n, 1n, 3n, s);
  });

  it("refuses held > supply", () => {
    expect(shareValue(10n, 4n, 3n).ok).toBe(false);
  });

  it("holds invariants across samples", () => {
    for (const [p, h, s] of [
      [1n, 0n, 1n],
      [10n, 1n, 3n],
      [1_000_000n, 1n, 1000n],
      [999n, 2n, 7n],
    ] as const) {
      const r = shareValue(p, h, s);
      expect(r.ok).toBe(true);
      if (r.ok) assertSliceInvariants(p, h, s, r);
    }
  });
});

describe("sumHolderFloors", () => {
  it("sums floors and dust", () => {
    // 10 price, supply 3: each of two holders with 1 share → value 3 rem 1 each
    const r = sumHolderFloors(10n, [1n, 1n], 3n);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.sum).toBe(6n);
    expect(r.dustTotal).toBe(2n);
  });
});

describe("comparePrices", () => {
  it("shows value delta", () => {
    const c = comparePrices(1n, 1000n, 1_000_000n, 2_000_000n);
    expect(c.ok).toBe(true);
    if (!c.ok) return;
    expect(c.valueDelta).toBe(-1000n);
  });
});

describe("ownershipBps", () => {
  it("1 of 1000 is 10 bps", () => {
    expect(ownershipBps(1n, 1000n)).toEqual({ ok: true, bps: 10n });
  });
});
