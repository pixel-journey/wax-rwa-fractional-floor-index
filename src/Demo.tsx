"use client";

import { useMemo, useState } from "react";
import { downloadText, exportSliceMarkdown } from "./exportReport";
import { SCENARIOS } from "./fixtures";
import {
  comparePrices,
  ownershipBps,
  shareValue,
  sumHolderFloors,
} from "./floor";
import { FLOOR_MYTHS, GLOSSARY } from "./myths";

export function Demo() {
  const [whole, setWhole] = useState("1000000");
  const [held, setHeld] = useState("1");
  const [supply, setSupply] = useState("1000");
  const [priceB, setPriceB] = useState("2000000");
  const [compare, setCompare] = useState(false);
  const [multi, setMulti] = useState(false);
  const [holdingsText, setHoldingsText] = useState("1, 1");

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

  const bps = useMemo(() => {
    try {
      return ownershipBps(BigInt(held.trim() || "0"), BigInt(supply.trim() || "0"));
    } catch {
      return null;
    }
  }, [held, supply]);

  const cmp = useMemo(() => {
    if (!compare) return null;
    try {
      return comparePrices(
        BigInt(held.trim() || "0"),
        BigInt(supply.trim() || "0"),
        BigInt(whole.trim() || "0"),
        BigInt(priceB.trim() || "0")
      );
    } catch {
      return null;
    }
  }, [compare, held, supply, whole, priceB]);

  const multiSum = useMemo(() => {
    if (!multi) return null;
    try {
      const parts = holdingsText
        .split(/[,\s]+/)
        .filter(Boolean)
        .map((x) => BigInt(x));
      return sumHolderFloors(
        BigInt(whole.trim() || "0"),
        parts,
        BigInt(supply.trim() || "0")
      );
    } catch {
      return { ok: false as const, reason: "Invalid holdings list" };
    }
  }, [multi, holdingsText, whole, supply]);

  const applyScenario = (id: string) => {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setWhole(s.wholePrice);
    setHeld(s.held);
    setSupply(s.supply);
  };

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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
        {SCENARIOS.map((s) => (
          <button key={s.id} type="button" onClick={() => applyScenario(s.id)}>
            {s.label}
          </button>
        ))}
      </div>

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
        <>
          <p>
            Value <strong>{slice.value.toString()}</strong> · remainder{" "}
            <strong>{slice.remainder.toString()}</strong>
            {slice.exact ? " · exact" : ""}
          </p>
          {bps && bps.ok && (
            <p style={{ fontSize: "0.9rem" }}>
              Ownership <strong>{bps.bps.toString()}</strong> bps
            </p>
          )}
          <button
            type="button"
            onClick={() =>
              downloadText(
                "share-value.md",
                exportSliceMarkdown(whole, held, supply, slice)
              )
            }
          >
            Download MD
          </button>
        </>
      ) : (
        <p>{slice.reason}</p>
      )}

      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1.5rem" }}>
        <input
          type="checkbox"
          checked={compare}
          onChange={(e) => setCompare(e.target.checked)}
        />
        Compare against a second whole price
      </label>
      {compare && (
        <label style={{ display: "block", margin: "0.5rem 0 1rem" }}>
          Second whole price
          <input
            value={priceB}
            onChange={(e) => setPriceB(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
      )}
      {cmp && cmp.ok && (
        <p style={{ fontSize: "0.9rem" }}>
          A value {cmp.a.value.toString()} · B value {cmp.b.value.toString()} · Δ{" "}
          {cmp.valueDelta.toString()}
        </p>
      )}

      <label style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1rem" }}>
        <input
          type="checkbox"
          checked={multi}
          onChange={(e) => setMulti(e.target.checked)}
        />
        Sum multiple holders’ floors (dust demo)
      </label>
      {multi && (
        <label style={{ display: "block", margin: "0.5rem 0 1rem" }}>
          Holdings list
          <input
            value={holdingsText}
            onChange={(e) => setHoldingsText(e.target.value)}
            placeholder="1, 1"
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
      )}
      {multiSum && multiSum.ok && (
        <p style={{ fontSize: "0.9rem" }}>
          Floor sum <strong>{multiSum.sum.toString()}</strong> · dustTotal{" "}
          <strong>{multiSum.dustTotal.toString()}</strong>
        </p>
      )}
      {multiSum && !multiSum.ok && <p>{multiSum.reason}</p>}

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Glossary</h2>
        <dl>
          {GLOSSARY.map((g) => (
            <div key={g.term} style={{ marginBottom: "0.5rem" }}>
              <dt>
                <strong>{g.term}</strong>
              </dt>
              <dd style={{ margin: 0 }}>{g.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        See EDUCATION.md · POLICY.md · SECURITY.md · companions: market-cap-bubble,
        dust-truncation-visualizer
      </p>
    </main>
  );
}
