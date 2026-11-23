# AI handoff — fractional floor index

## Non-negotiables

1. `shareValue = floor(wholePrice * held / supply)`.
2. Conservation: `value * supply + remainder === wholePrice * held`.
3. `shareValue(100_000_000n, 1n, 4n)` → value `25000000`, exact.
4. `shareValue(10n, 1n, 3n)` → value `3`, remainder `1`.
5. held > supply is refused.
6. `equalSplit(10n, 3)` leftover shares are **not** the same gap as price remainder.
7. **Not** a live RWA index, NAV, or market read. Arguments only. Use bigint.

## Prompt seeds

- "Show conservation for wholePrice 10, held 1, supply 3."
- "Contrast equal-split leftover with price remainder."
- "Refuse calling this a live fractional floor index."

## Do not

- Claim holder floors sum to the whole price.
- Fetch a market or NAV in unit tests.
- Treat a passed integer as an oracle price.
