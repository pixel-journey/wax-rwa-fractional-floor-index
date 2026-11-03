import { describe, expect, it } from "vitest";
import {
  assertSliceInvariants,
  comparePrices,
  equalSplit,
  equalSplitDust,
  minHeldForValue,
  ownershipBps,
  shareValue,
  sumHolderFloors,
} from "./floor";

describe("shareValue", () => {
  it("divides evenly", () => {
    const s = shareValue(100_000_000n, 1n, 4n);
    expect(s.ok && s.value).toBe(25_000_000n);
    if (s.ok) assertSliceInvariants(100_000_000n, 1n, 4n, s);
  });

  it("keeps remainder", () => {
    const s = shareValue(10n, 1n, 3n);
    expect(s).toMatchObject({ ok: true, value: 3n, remainder: 1n });
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
    expect(c.ok && c.valueDelta).toBe(-1000n);
  });
});

describe("ownershipBps", () => {
  it("1 of 1000 is 10 bps", () => {
    expect(ownershipBps(1n, 1000n)).toEqual({ ok: true, bps: 10n });
  });
});

describe("minHeldForValue", () => {
  it("finds minimum held for value ≥ 1000 at price 1M supply 1000", () => {
    // value = 1_000_000 * held / 1000 = 1000 * held → held 1 gives 1000
    const r = minHeldForValue(1_000_000n, 1000n, 1000n);
    expect(r.ok && r.held).toBe(1n);
  });
  it("minValue 0 → held 0", () => {
    expect(minHeldForValue(100n, 10n, 0n)).toEqual({ ok: true, held: 0n });
  });
});

describe("equalSplit / equalSplitDust", () => {
  it("splits 10 into 3 → each 3 leftover 1", () => {
    expect(equalSplit(10n, 3)).toEqual({ ok: true, each: 3n, leftover: 1n });
  });
  it("reports gap vs wholePrice", () => {
    const d = equalSplitDust(10n, 3n, 3);
    expect(d.ok).toBe(true);
    if (!d.ok) return;
    // each holds 1 (3/3=1), three holders → sum floors of 1 each on price 10 supply 3
    expect(d.each).toBe(1n);
    expect(d.floorSum).toBe(9n);
    expect(d.gap).toBe(1n);
  });
});
