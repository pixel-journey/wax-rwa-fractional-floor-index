"use client";

import { useEffect, useMemo, useState } from "react";
import { Cases } from "./Cases";
import {
  downloadText,
  exportSliceCsv,
  exportSliceMarkdown,
} from "./exportReport";
import { SCENARIOS } from "./fixtures";
import {
  comparePrices,
  equalSplitDust,
  minHeldForValue,
  ownershipBps,
  shareValue,
  sumHolderFloors,
} from "./floor";
import { FLOOR_MYTHS, GLOSSARY } from "./myths";
import { decodeShareState, encodeShareState } from "./shareState";
import { WORKED_EXAMPLES } from "./workedExamples";

const LS_KEY = "pxj-rwa-floor-v1";

export function Demo() {
  const [whole, setWhole] = useState("1000000");
  const [held, setHeld] = useState("1");
  const [supply, setSupply] = useState("1000");
  const [priceB, setPriceB] = useState("2000000");
  const [compare, setCompare] = useState(false);
  const [multi, setMulti] = useState(false);
  const [holdingsText, setHoldingsText] = useState("1, 1");
  const [shareMsg, setShareMsg] = useState("");
  const [minVal, setMinVal] = useState("1000");
  const [parts, setParts] = useState("3");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const fromUrl = decodeShareState(window.location.search);
    if (fromUrl.whole || fromUrl.held || fromUrl.supply) {
      if (fromUrl.whole) setWhole(fromUrl.whole);
      if (fromUrl.held) setHeld(fromUrl.held);
      if (fromUrl.supply) setSupply(fromUrl.supply);
      if (fromUrl.compare) setCompare(true);
      if (fromUrl.priceB) setPriceB(fromUrl.priceB);
      if (fromUrl.multi) setMulti(true);
      if (fromUrl.holdingsText) setHoldingsText(fromUrl.holdingsText);
      return;
    }
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const p = JSON.parse(raw) as Record<string, string>;
      if (p.whole) setWhole(p.whole);
      if (p.held) setHeld(p.held);
      if (p.supply) setSupply(p.supply);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ whole, held, supply }));
    } catch {
      /* ignore */
    }
  }, [whole, held, supply]);

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
      const partsH = holdingsText
        .split(/[,\s]+/)
        .filter(Boolean)
        .map((x) => BigInt(x));
      return sumHolderFloors(
        BigInt(whole.trim() || "0"),
        partsH,
        BigInt(supply.trim() || "0")
      );
    } catch {
      return { ok: false as const, reason: "Invalid holdings list" };
    }
  }, [multi, holdingsText, whole, supply]);

  const minHeld = useMemo(() => {
    try {
      return minHeldForValue(
        BigInt(whole.trim() || "0"),
        BigInt(supply.trim() || "0"),
        BigInt(minVal.trim() || "0")
      );
    } catch {
      return null;
    }
  }, [whole, supply, minVal]);

  const splitDust = useMemo(() => {
    try {
      return equalSplitDust(
        BigInt(whole.trim() || "0"),
        BigInt(supply.trim() || "0"),
        Number(parts)
      );
    } catch {
      return null;
    }
  }, [whole, supply, parts]);

  const applyScenario = (id: string) => {
    const s = SCENARIOS.find((x) => x.id === id);
    if (!s) return;
    setWhole(s.wholePrice);
    setHeld(s.held);
    setSupply(s.supply);
  };

  const copyShare = async () => {
    const qs = encodeShareState({
      whole,
      held,
      supply,
      priceB,
      compare,
      multi,
      holdingsText,
    });
    const path =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}?${qs}`
        : `?${qs}`;
    try {
      await navigator.clipboard.writeText(path);
      setShareMsg("Share URL copied");
    } catch {
      setShareMsg(path);
    }
  };

  return (
    <main className="wrap">
      <style>{`@media print { button, .no-print { display: none !important; } }`}</style>
      <p className="kicker">Educational reference · Pixel Journey</p>
      <h1>One share of a whole price</h1>
      <p className="lede">
        Integer division of wholePrice × held / supply. Remainder kept. Not a market
        index.
      </p>

      <section
        className="no-print"
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

      <div className="no-print" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
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
          <div className="no-print" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
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
            <button
              type="button"
              onClick={() =>
                downloadText(
                  "share-value.csv",
                  exportSliceCsv({
                    wholePrice: whole,
                    held,
                    supply,
                    value: slice.value.toString(),
                    remainder: slice.remainder.toString(),
                    exact: String(slice.exact),
                  }),
                  "text/csv;charset=utf-8"
                )
              }
            >
              Download CSV
            </button>
            <button type="button" onClick={() => void copyShare()}>
              Copy share URL
            </button>
            <button type="button" onClick={() => window.print()}>
              Print
            </button>
          </div>
          {shareMsg && (
            <p className="no-print" style={{ fontSize: "0.85rem", opacity: 0.8 }}>
              {shareMsg}
            </p>
          )}
        </>
      ) : (
        <p>{slice.reason}</p>
      )}

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Min held for a floor value</h2>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Target min value
          <input
            value={minVal}
            onChange={(e) => setMinVal(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
        {minHeld && minHeld.ok ? (
          <p>
            Need held ≥ <strong>{minHeld.held.toString()}</strong>
          </p>
        ) : minHeld && !minHeld.ok ? (
          <p>{minHeld.reason}</p>
        ) : null}
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Equal-split dust</h2>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Parts
          <input
            value={parts}
            onChange={(e) => setParts(e.target.value)}
            style={{ display: "block", width: "100%", marginTop: "0.25rem" }}
          />
        </label>
        {splitDust && splitDust.ok ? (
          <p style={{ fontSize: "0.9rem" }}>
            each {splitDust.each.toString()} · leftoverShares{" "}
            {splitDust.leftoverShares.toString()} · floorSum{" "}
            {splitDust.floorSum.toString()} · gap <strong>{splitDust.gap.toString()}</strong>
          </p>
        ) : splitDust && !splitDust.ok ? (
          <p>{splitDust.reason}</p>
        ) : null}
      </section>

      <label className="no-print" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1.5rem" }}>
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

      <label className="no-print" style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "1rem" }}>
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

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Worked examples</h2>
        <table>
          <thead>
            <tr>
              <th>whole</th>
              <th>held</th>
              <th>supply</th>
              <th>value</th>
              <th>remainder</th>
            </tr>
          </thead>
          <tbody>
            {WORKED_EXAMPLES.map((row) => (
              <tr key={`${row.whole}-${row.held}-${row.supply}`}>
                <td>{row.whole}</td>
                <td>{row.held}</td>
                <td>{row.supply}</td>
                <td>{row.value}</td>
                <td>{row.remainder}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <div className="no-print">
        <Cases />
      </div>

      <section style={{ marginTop: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem" }}>Runbook</h2>
        <ol style={{ fontSize: "0.9rem" }}>
          <li>Set whole-asset price, held, and supply.</li>
          <li>Read floor value, remainder, ownership bps.</li>
          <li>Optional: min held for a target value; equal-split gap; compare; multi-holder.</li>
          <li>Export / share / print — still not a live NAV claim.</li>
        </ol>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
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

      <p className="no-print" style={{ marginTop: "2rem", fontSize: "0.85rem", opacity: 0.75 }}>
        See EDUCATION.md · SECURITY.md · POLICY.md
      </p>
    </main>
  );
}
