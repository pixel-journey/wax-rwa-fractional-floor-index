# Security — fractional floor index

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Remainder conservation | `value * supply + remainder === wholePrice * held` |
| held > supply | refused |
| Non-positive supply / negative price | refused |
| Equal split leftover shares | separate from price-floor dust |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Redeemability | Floor is **not** a guaranteed claim |
| Live NAV / oracle | Arguments only |
| Legal RWA structure | Outside this lab |
| Token precision | Teaching integers — not PXJ@8 unless explicitly adapted |

## Attack angles

1. Treating sum of holder floors as the whole price (floor dust remains).  
2. Marketing "index" as a live RWA product.  
3. Collapsing leftover **shares** and price **remainder** into one "dust" word.  
4. Letting held exceed supply.  
5. Claiming a market oracle was read when only integers were passed.

## Honesty limits

No keys or market APIs. Integer division only.

| Sibling | Distinction |
| --- | --- |
| [market-cap bubble](https://github.com/pixel-journey/wax-alcor-market-cap-bubble-chart) | Visual liquidity encoding |
| [token balance ledger](https://github.com/pixel-journey/px-token-balance-ledger) | Conservation of balances |

[docs.wax.io](https://docs.wax.io/).
