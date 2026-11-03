# Education — fractional share value

## Pattern

```text
value     = floor(wholePrice * held / supply)
remainder = (wholePrice * held) % supply
```

A positive `held` can still produce a small `value` and a non-zero `remainder` when the product does not divide evenly.

## Teaching points

1. This is **not** a live RWA index or appraisal oracle.
2. Summing per-holder floors can leave **dust** versus `wholePrice`.
3. `ownershipBps` is a separate integer view of held/supply.
4. Contract authors should unit-test tiny `held` against large `supply`.

## Related

- `px-token-dust-truncation-visualizer` — tax/reward dust
- `wax-market-cap-bubble` — supply × unit price scale
- `wax-carbon-credit-and-sustainability-oracle` — another floor/remainder lab
