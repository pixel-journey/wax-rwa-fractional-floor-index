export type ShareState = {
  whole: string;
  held: string;
  supply: string;
  priceB: string;
  compare: boolean;
  multi: boolean;
  holdingsText: string;
};

export function encodeShareState(s: ShareState): string {
  const q = new URLSearchParams();
  q.set("p", s.whole);
  q.set("h", s.held);
  q.set("s", s.supply);
  if (s.compare) {
    q.set("cmp", "1");
    q.set("pb", s.priceB);
  }
  if (s.multi) {
    q.set("m", "1");
    q.set("hs", s.holdingsText);
  }
  return q.toString();
}

export function decodeShareState(search: string): Partial<ShareState> {
  const q = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const out: Partial<ShareState> = {};
  if (q.has("p")) out.whole = q.get("p") ?? undefined;
  if (q.has("h")) out.held = q.get("h") ?? undefined;
  if (q.has("s")) out.supply = q.get("s") ?? undefined;
  if (q.get("cmp") === "1") {
    out.compare = true;
    out.priceB = q.get("pb") ?? undefined;
  }
  if (q.get("m") === "1") {
    out.multi = true;
    out.holdingsText = q.get("hs") ?? undefined;
  }
  return out;
}
