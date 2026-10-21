"use client";

import { shareValue } from "./floor";

export function Demo() {
  const slice = shareValue(100_000_000n, 1n, 4n);
  const awkward = shareValue(10n, 1n, 3n);
  return (
    <main className="wrap">
      <p className="kicker">Educational reference</p>
      <h1>One share of a whole price</h1>
      <p className="lede">Integer division. A remainder is not rounded away. This is not a floor index and no market was read.</p>
      {slice.ok && awkward.ok ? (
        <p>
          1 of 4 of 100000000 is {slice.value.toString()}. 1 of 3 of 10 is {awkward.value.toString()} with remainder {awkward.remainder.toString()}.
        </p>
      ) : (
        <p>The sample failed.</p>
      )}
    </main>
  );
}
