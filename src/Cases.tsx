"use client";

const CASES = [
  {
    title: "Even split",
    body: "100M across 4 shares → each floor value 25M, remainder 0.",
  },
  {
    title: "Dust remainder",
    body: "Price 10, held 1, supply 3 → value 3, remainder 1.",
  },
  {
    title: "Multi-holder dust",
    body: "Two holders with 1 share each under supply 3 leave dustTotal 2 when floors are summed.",
  },
  {
    title: "Not a market index",
    body: "wholePrice is an argument, not a live appraisal or order-book floor.",
  },
] as const;

export function Cases() {
  return (
    <section aria-label="Teaching cases" style={{ marginTop: "2rem" }}>
      <h2 style={{ fontSize: "1rem" }}>Cases</h2>
      <ul style={{ paddingLeft: "1.2rem", fontSize: "0.9rem" }}>
        {CASES.map((c) => (
          <li key={c.title} style={{ marginBottom: "0.5rem" }}>
            <strong>{c.title}.</strong> {c.body}
          </li>
        ))}
      </ul>
    </section>
  );
}
