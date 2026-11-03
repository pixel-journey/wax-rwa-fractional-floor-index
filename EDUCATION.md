# Education — fractional share value

## Pattern

```text
value     = floor(wholePrice * held / supply)
remainder = (wholePrice * held) % supply
```

## Teaching points

1. Not a live RWA index or appraisal oracle.
2. Per-holder floors leave **dust**; equal splits can leave a **gap** vs wholePrice.
3. `minHeldForValue` plans the smallest holding for a target floor value.
4. `ownershipBps` is a separate integer view of held/supply.

## Related

- `px-token-dust-truncation-visualizer`
- `wax-market-cap-bubble`
- `wax-carbon-credit-and-sustainability-oracle`
