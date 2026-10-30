export const FLOOR_MYTHS = [
  {
    myth: "This is a live RWA floor-price index",
    reality:
      "Pure integer shareValue(wholePrice, held, supply). No market is read.",
  },
  {
    myth: "Remainders round up to a full unit",
    reality:
      "Division truncates. Remainder is exposed so dust is visible.",
  },
  {
    myth: "Held can exceed supply",
    reality:
      "Refused. Held must be ≤ supply.",
  },
] as const;
