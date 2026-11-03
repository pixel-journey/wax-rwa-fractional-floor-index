export const SCENARIOS = [
  {
    id: "even",
    label: "1/4 of 100M",
    wholePrice: "100000000",
    held: "1",
    supply: "4",
  },
  {
    id: "dust",
    label: "1/3 of 10 (remainder)",
    wholePrice: "10",
    held: "1",
    supply: "3",
  },
  {
    id: "rwa",
    label: "1 of 1000 @ 1M",
    wholePrice: "1000000",
    held: "1",
    supply: "1000",
  },
  {
    id: "zero-held",
    label: "0 held",
    wholePrice: "1000000",
    held: "0",
    supply: "1000",
  },
] as const;
