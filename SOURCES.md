# Sources

| Source | Use |
| --- | --- |
| [docs.wax.io](https://docs.wax.io/) | Product context only |
| [market-cap bubble](https://github.com/pixel-journey/wax-market-cap-bubble) | Related floor + remainder identity |
| [SECURITY.md](SECURITY.md) | Non-claims |

## Product facts locked by tests

```text
shareValue = floor(wholePrice * held / supply)
value * supply + remainder === wholePrice * held
```

- `shareValue(100_000_000n, 1n, 4n)` → value `25000000`, remainder `0`.
- `shareValue(10n, 1n, 3n)` → value `3`, remainder `1`.
- `equalSplit(10n, 3)` → each `3`, leftover shares `1` (different gap from price remainder).
- `ownershipBps(1n, 1000n)` → `10`.
- **Not** a live RWA index or NAV oracle.
