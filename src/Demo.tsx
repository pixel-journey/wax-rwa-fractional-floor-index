"use client";

import { useMemo, useState } from "react";
import { shareValue } from "./floor";
import { FLOOR_MYTHS } from "./myths";

export function Demo() {
  const [whole, setWhole] = useState("1000000");
  const [held, setHeld] = useState("1");
  const [supply, setSupply] = useState("1000");
  const slice = useMemo(() => {
    try {
      return shareValue(
        BigInt(whole.trim() || "0"),
        BigInt(held.trim() || "0"),
        BigInt(supply.trim() || "0")
      );
    } catch {
      return { ok: false as const, reason: "Enter non-negative integers; supply > 0" };
    }
  }, [whole, held, supply]);

  return (
    <main className="wrap">
      <p className="kicker">Educational reference · Pixel Journey</p>
      <h1>One share of a whole price</h1>
      <p className="lede">
        Integer division of wholePrice × held / supply. Remainder kept. Not a market
        index.
      </p>

      <section
        style={{
          marginBottom: "1.5rem",
          padding: "1rem",
          border: "1px solid #a855f744",
          borderRadius: "12px",
        }}
      >
        <h2 style={{ fontSize: "1rem", marginTop: 0 }}>Myths vs reality</h2>
        {FLOOR_MYTHS.map((m) => (
          <div key={m.myth} style={{ marginBottom: "0.75rem", fontSize: "0.9rem" }}>
            <p style={{ margin: 0 }}>
              <strong>Myth:</strong> {m.myth}
            </p>
            <p style={{ margin: "0.25rem 0 0" }}>
              <strong>Reality:</strong> {m.reality}
            </p>
          </div>
        ))}
      </section>

      <label style={{ display: "block", marginBottom: "0.75rem" }}>
        Whole-asset price
        <input
          value={whole}
          onChange={(e) => setWhole(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>
      <label style={{ display: "block", marginBottom: "0.75rem" }}>
        Held shares
        <input
          value={held}
          onChange={(e) => setHeld(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>
      <label style={{ display: "block", marginBottom: "1rem" }}>
        Total supply
        <input
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
        />
      </label>

      {slice.ok ? (
        <p>
          Value <strong>{slice.value.toString()}</strong> · remainder{" "}
          <strong>{slice.remainder.toString()}</strong>
        </p>
      ) : (
        <p>{slice.reason}</p>
      )}

      <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        See POLICY.md · companions: market-cap-bubble, dust-truncation-visualizer.
      </p>
    </main>
  );
}
