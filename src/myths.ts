export const FLOOR_MYTHS = [
  {
    myth: "This is a live RWA floor-price or NAV index",
    reality:
      "Pure shareValue(wholePrice, held, supply). No market, oracle, or appraisal feed.",
  },
  {
    myth: "Remainders round up to a full unit",
    reality: "Division truncates. Remainder is exposed so dust is visible.",
  },
  {
    myth: "Sum of holder floors always equals wholePrice",
    reality:
      "Each holder floors independently. Dust can remain; sumHolderFloors reports dustTotal.",
  },
  {
    myth: "Held can exceed supply",
    reality: "Refused. Held must be ≤ supply.",
  },
] as const;

export const GLOSSARY = [
  {
    term: "value",
    meaning: "floor(wholePrice * held / supply) — the holder’s integer slice.",
  },
  {
    term: "remainder",
    meaning: "(wholePrice * held) % supply — mass not captured in value.",
  },
  {
    term: "ownershipBps",
    meaning: "floor(held * 10000 / supply) — ownership in basis points.",
  },
] as const;
