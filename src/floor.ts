/**
 * One holder's slice of a whole-asset price. Integer division.
 * Not a market index and not a variance forecast.
 */

export type Slice = { ok: false; reason: string } | { ok: true; value: bigint; remainder: bigint };

export function shareValue(wholePrice: bigint, held: bigint, supply: bigint): Slice {
  if (wholePrice < 0n || held < 0n || supply <= 0n) return { ok: false, reason: "price and held must be non-negative and supply positive" };
  if (held > supply) return { ok: false, reason: "held cannot exceed supply" };
  const product = wholePrice * held;
  return { ok: true, value: product / supply, remainder: product % supply };
}
