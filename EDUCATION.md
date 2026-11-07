# Education — a holder's floor of a whole price

> **Rung:** `npm test` passes. `shareValue` is `floor(wholePrice * held / supply)` plus the remainder. It is **not** a live RWA index, not variance, and not a NAV oracle.  
> **The test is the rule.**

## What you should be able to do

| Level | After this file |
| --- | --- |
| Beginner | Split a 100000000 price into four equal 25000000 slices, and keep the remainder on 10 / 3 |
| Intermediate | Sum holder floors, measure equal-split dust, and find the smallest held that reaches a value |
| Masterclass | Say why leftover shares and floor dust are different gaps |

---

## Beginner — one scene

```ts
shareValue(100_000_000n, 1n, 4n)
// value 25000000, remainder 0, exact true

shareValue(10n, 1n, 3n)
// value 3, remainder 1, exact false
```

Held cannot exceed supply. Price and held must be non-negative. Supply must be positive. All three must be bigint.

The invariant the tests lock: `value * supply + remainder === wholePrice * held`.

### Words

| Word | Meaning here |
| --- | --- |
| Whole price | An integer you pass. Not a market read |
| Held / supply | Share counts. Held ≤ supply |
| Value | Floor of price × held / supply |
| Remainder | The units the floor dropped |
| Ownership bps | `floor(held * 10000 / supply)` |

### Predict, then run

```bash
npm test
```

1. `ownershipBps(1n, 1000n)` is 10.
2. `sumHolderFloors(10n, [1n, 1n], 3n)` is sum 6, dustTotal 2.
3. `comparePrices(1n, 1000n, 1_000_000n, 2_000_000n)` has valueDelta −1000 (price A minus price B).

---

## Intermediate — equal split still leaves a gap

`equalSplit(10n, 3)` is each 3, leftover 1. The leftover shares are assigned to no one.

`equalSplitDust(10n, 3n, 3)`:

| Field | Value |
| --- | --- |
| each | 1 (supply 3 / 3 parts) |
| floorSum | 9 |
| gap | 1 |

Three holders each floor `10 * 1 / 3 = 3`. Sum 9. The whole price was 10. One unit of floor dust remains. That is separate from leftover *shares*.

`minHeldForValue(1_000_000n, 1000n, 1000n)` is 1. A min value of 0 returns held 0. The helper uses ceil so the floor is at least the target.

### Attack → test

| Attack | Naive code | This lab | Test |
| --- | --- | --- | --- |
| Treat 10/3 as 3.333 and sum past the price | Over-allocation | value 3, remainder 1 | `keeps remainder` |
| Let held exceed supply | Fake ownership | refused | `refuses held > supply` |
| Sum floors and claim they equal the whole price | Lost dust | 6 of 10 with dust 2 | `sums floors and dust` |
| Ignore leftover shares in an equal split | Silent missing holder | leftover 1 on 10/3 | `splits 10 into 3` |
| Claim 1 of 1000 is 0.1% without the floor | Close enough | 10 bps exactly here; floor in general | `1 of 1000 is 10 bps` |

---

## Masterclass — two different leftovers

`equalSplit` leftover is **shares** that were not assigned (`supply % parts`).

`shareValue` remainder is **price units** the floor dropped (`(price * held) % supply`).

`equalSplitDust` reports both: leftover shares, and the gap between the whole price and the sum of floors. In the tested case the share leftover is 0 (3 divides by 3) and the price gap is 1. Do not collapse those into one "dust" word.

Still absent:

- A market read, a floor-price oracle, or variance. The file header says so.
- A claim that the whole price is recoverable. Floor dust means the sum of holder floors can be less than the whole price.
- Any WAX account or token.

### Exercise

1. Price 10, held 1, supply 3. Value and remainder? (3 and 1. Tested.)
2. Equal split of supply 10 into 3. Each and leftover? (3 and 1. Tested.)
3. Is this a NAV? (No. It is integer division of numbers you passed.)

---

## What this course will not teach

- A live RWA index
- Variance or a price oracle
- That holder floors sum to the whole price
