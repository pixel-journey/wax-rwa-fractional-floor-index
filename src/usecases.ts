import { ATOMIC_ORIGIN, atomicSales } from "./api";
import { shareValue } from "./floor";
import type { ChainAction, HttpRequest } from "./api";

export type UseCase = {
  title: string;
  detail: string;
  request: HttpRequest;
  transaction: { note: string; actions: ChainAction[] } | null;
};

const slice = shareValue(100_000_000n, 1n, 4n);
if (!slice.ok) throw new Error(slice.reason);
const oneQuarter = slice;

export const USE_CASES: UseCase[] = [
  {
    title: "Sales are not this division",
    detail: `1 of 4 of 100000000 is ${oneQuarter.value.toString()}. atomicmarket sales are not parsed. The request is not sent.`,
    request: atomicSales(ATOMIC_ORIGIN, "alice"),
    transaction: null,
  },
  {
    title: "A template read is not a floor",
    detail: "1 of 3 of 10 leaves a remainder of 1. No index is published and no trade is built.",
    request: { method: "GET", url: `${ATOMIC_ORIGIN}/atomicassets/v1/templates/pixeljourney/1`, executed: false },
    transaction: null,
  },
];

export function assertUseCases(): void {
  if (oneQuarter.remainder !== 0n) throw new Error("remainder");
  const awkward = shareValue(10n, 1n, 3n);
  if (!awkward.ok || awkward.remainder !== 1n) throw new Error("awkward");
}
