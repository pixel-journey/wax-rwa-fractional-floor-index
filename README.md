# A holder's floor of a whole price — not an RWA index

> **Trust:** `educational-reference`  
> **Catalog:** `wax-ecosystem-blueprint-catalog` (private index; not this public course)

**One-sentence goal:** Teach `floor(wholePrice * held / supply)`, the remainder, equal-split leftover shares, and the gap when holder floors do not add back to the whole price.

**Real code:** `npm test`. **Does not** read a market, a NAV, or a token.

The course is [EDUCATION.md](EDUCATION.md).

## What is true (executed)

| Rule | Result |
| --- | --- |
| `shareValue(100_000_000n, 1n, 4n)` | value 25000000, exact |
| `shareValue(10n, 1n, 3n)` | value 3, remainder 1 |
| held > supply | refused |
| `sumHolderFloors(10n, [1n, 1n], 3n)` | sum 6, dust 2 |
| `ownershipBps(1n, 1000n)` | 10 |
| `minHeldForValue(1_000_000n, 1000n, 1000n)` | held 1 |
| min value 0 | held 0 |
| `equalSplit(10n, 3)` | each 3, leftover 1 |
| `equalSplitDust(10n, 3n, 3)` | each 1, floorSum 9, gap 1 |

Invariant: `value * supply + remainder === wholePrice * held`.

## What is in the repo

| Piece | Role |
| --- | --- |
| `src/floor.ts` | slice, sum, ownership, min held, equal split |
| `src/floor.test.ts` | the executed rule |
| `src/Demo.tsx` | interactive slices |
| Docs | EDUCATION · POLICY · SECURITY · VERIFICATION-LOG |

## Run

```bash
npm install
npm test
npm run dev
```

## Best practice and the opposite

**Do** keep price, held, and supply as bigint.  
**Do** show the remainder next to the floor.  
**Do** separate leftover shares from floor dust.

**Do not** call this a live fractional floor index.  
**Do not** claim holder floors sum to the whole price.  
**Do not** treat a passed integer as an oracle price.

## Related

- `wax-market-cap-bubble`
- `px-token-dust-truncation-visualizer`
- `px-token-ft-decimal-supply-simulator`

MIT — Pixel Journey
