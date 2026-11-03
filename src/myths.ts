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
      "Each holder floors independently. Dust and unassigned leftover shares create a gap.",
  },
  {
    myth: "Held can exceed supply",
    reality: "Refused. Held must be ≤ supply.",
  },
  {
    myth: "Equal split of supply always prices the whole asset",
    reality:
      "equalSplitDust shows floorSum can be less than wholePrice after per-holder floors.",
  },
] as const;

export const GLOSSARY = [
  {
    term: "value",
    meaning: "floor(wholePrice * held / supply) — the holder’s integer slice.",
  },
  {
    term: "remainder",
    meaning: "(wholePrice * held) % supply — not captured in value.",
  },
  {
    term: "ownershipBps",
    meaning: "floor(held * 10000 / supply).",
  },
  {
    term: "minHeldForValue",
    meaning: "Smallest held whose floor value is at least a target.",
  },
  {
    term: "equalSplitDust",
    meaning: "Gap between wholePrice and the sum of equal-holder floors.",
  },
] as const;
