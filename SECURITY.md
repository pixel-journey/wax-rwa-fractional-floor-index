# Security — fractional floor index

## Closed in tests

| Issue | Behavior |
| --- | --- |
| Remainder conservation | `value * supply + remainder === wholePrice * held` |
| held > supply | refused |
| Non-positive supply / negative price | refused |

## Not closed (production)

| Concern | Guidance |
| --- | --- |
| Redeemability | Floor is not a guaranteed claim |
| Live NAV / oracle | Arguments only |
| Legal RWA structure | Outside this lab |

## Attack angles

1. Treating sum of holder floors as the whole price (floor dust).  
2. Marketing "index" as a live RWA product.  
3. Collapsing leftover shares and price remainder into one "dust" word.

## Honesty limits

No keys or market APIs. [docs.wax.io](https://docs.wax.io/) · [market-cap bubble](https://github.com/pixel-journey/wax-market-cap-bubble).
