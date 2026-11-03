import { describe, expect, it } from "vitest";
import { decodeShareState, encodeShareState } from "./shareState";

describe("shareState", () => {
  it("round-trips", () => {
    const raw = encodeShareState({
      whole: "1000000",
      held: "1",
      supply: "1000",
      priceB: "2000000",
      compare: true,
      multi: false,
      holdingsText: "",
    });
    const d = decodeShareState(raw);
    expect(d.whole).toBe("1000000");
    expect(d.compare).toBe(true);
    expect(d.priceB).toBe("2000000");
  });
});
