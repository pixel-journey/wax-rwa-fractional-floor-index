/**
 * One holder's integer slice of a whole-asset price.
 * Educational only — not a live RWA index, not variance, not a NAV oracle.
 */

export type SliceOk = {
  ok: true;
  value: bigint;
  remainder: bigint;
  product: bigint;
  exact: boolean;
};

export type SliceErr = { ok: false; reason: string };
export type Slice = SliceOk | SliceErr;

export function shareValue(
  wholePrice: bigint,
  held: bigint,
  supply: bigint
): Slice {
  if (
    typeof wholePrice !== "bigint" ||
    typeof held !== "bigint" ||
    typeof supply !== "bigint"
  ) {
    return { ok: false, reason: "wholePrice, held, and supply must be bigint" };
  }
  if (wholePrice < 0n || held < 0n) {
    return { ok: false, reason: "price and held must be non-negative" };
  }
  if (supply <= 0n) {
    return { ok: false, reason: "supply must be positive" };
  }
  if (held > supply) {
    return { ok: false, reason: "held cannot exceed supply" };
  }
  const product = wholePrice * held;
  const value = product / supply;
  const remainder = product % supply;
  return {
    ok: true,
    value,
    remainder,
    product,
    exact: remainder === 0n,
  };
}

export function assertSliceInvariants(
  wholePrice: bigint,
  held: bigint,
  supply: bigint,
  s: SliceOk
): void {
  if (s.product !== wholePrice * held) {
    throw new Error("product must equal wholePrice * held");
  }
  if (s.value * supply + s.remainder !== s.product) {
    throw new Error("value * supply + remainder must equal product");
  }
  if (s.exact && s.remainder !== 0n) {
    throw new Error("exact implies remainder 0");
  }
  if (!s.exact && (s.remainder <= 0n || s.remainder >= supply)) {
    throw new Error("remainder must be in (0, supply)");
  }
}

export function sumHolderFloors(
  wholePrice: bigint,
  holdings: readonly bigint[],
  supply: bigint
): { ok: false; reason: string } | { ok: true; sum: bigint; dustTotal: bigint } {
  if (holdings.length < 1 || holdings.length > 64) {
    return { ok: false, reason: "pass 1 to 64 holdings" };
  }
  let sum = 0n;
  let dustTotal = 0n;
  let heldSum = 0n;
  for (const h of holdings) {
    const s = shareValue(wholePrice, h, supply);
    if (!s.ok) return s;
    sum += s.value;
    dustTotal += s.remainder;
    heldSum += h;
  }
  if (heldSum > supply) {
    return { ok: false, reason: "combined held cannot exceed supply" };
  }
  return { ok: true, sum, dustTotal };
}

export function comparePrices(
  held: bigint,
  supply: bigint,
  priceA: bigint,
  priceB: bigint
): { ok: false; reason: string } | { ok: true; a: SliceOk; b: SliceOk; valueDelta: bigint } {
  const a = shareValue(priceA, held, supply);
  const b = shareValue(priceB, held, supply);
  if (!a.ok) return a;
  if (!b.ok) return b;
  return { ok: true, a, b, valueDelta: a.value - b.value };
}

export function ownershipBps(
  held: bigint,
  supply: bigint
): { ok: false; reason: string } | { ok: true; bps: bigint } {
  if (held < 0n || supply <= 0n) {
    return { ok: false, reason: "held non-negative and supply positive" };
  }
  if (held > supply) {
    return { ok: false, reason: "held cannot exceed supply" };
  }
  return { ok: true, bps: (held * 10_000n) / supply };
}

/**
 * Smallest held ≥ 1 such that floor(wholePrice * held / supply) ≥ minValue.
 * null if minValue is 0 (any held including 0 works for value 0) — returns 0n.
 * fails if even full supply cannot reach minValue.
 */
export function minHeldForValue(
  wholePrice: bigint,
  supply: bigint,
  minValue: bigint
): { ok: false; reason: string } | { ok: true; held: bigint } {
  if (wholePrice < 0n || supply <= 0n || minValue < 0n) {
    return { ok: false, reason: "wholePrice ≥ 0, supply > 0, minValue ≥ 0" };
  }
  if (minValue === 0n) return { ok: true, held: 0n };
  // ceil(minValue * supply / wholePrice) but wholePrice may be 0
  if (wholePrice === 0n) {
    return { ok: false, reason: "wholePrice 0 cannot fund positive minValue" };
  }
  const held = (minValue * supply + wholePrice - 1n) / wholePrice;
  if (held > supply) {
    return { ok: false, reason: "even full supply cannot reach minValue" };
  }
  return { ok: true, held };
}

/**
 * Split supply into `parts` equal integer holdings (remainder shares as leftover).
 * Educational for “equal split still leaves dust on price floors.”
 */
export function equalSplit(
  supply: bigint,
  parts: number
): { ok: false; reason: string } | { ok: true; each: bigint; leftover: bigint } {
  if (supply <= 0n) return { ok: false, reason: "supply must be positive" };
  if (!Number.isInteger(parts) || parts < 1 || parts > 64) {
    return { ok: false, reason: "parts must be an integer from 1 to 64" };
  }
  const each = supply / BigInt(parts);
  const leftover = supply % BigInt(parts);
  return { ok: true, each, leftover };
}

/**
 * Gap between wholePrice and sum of equal-split holder floors.
 */
export function equalSplitDust(
  wholePrice: bigint,
  supply: bigint,
  parts: number
): {
  ok: false;
  reason: string;
} | {
  ok: true;
  each: bigint;
  leftoverShares: bigint;
  floorSum: bigint;
  gap: bigint;
} {
  const split = equalSplit(supply, parts);
  if (!split.ok) return split;
  if (wholePrice < 0n) return { ok: false, reason: "wholePrice must be non-negative" };
  const holdings = Array.from({ length: parts }, () => split.each);
  // leftover shares assigned to no one in this equal model
  const floors = sumHolderFloors(wholePrice, holdings, supply);
  if (!floors.ok) return floors;
  const gap = wholePrice - floors.sum;
  return {
    ok: true,
    each: split.each,
    leftoverShares: split.leftover,
    floorSum: floors.sum,
    gap: gap < 0n ? 0n : gap,
  };
}
