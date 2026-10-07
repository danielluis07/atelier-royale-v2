import { getCloth, type Piece } from "@/lib/catalog";
import { SpecHeading } from "./spec-heading";

// DESIGN.md §6 Proof ledger: hairline-ruled rows of a condensed-caps label and
// a mono value, each with a mono row number, dotted leaders on desktop. Always
// visible text in the catalog's row order, never an accordion.
export function ProofLedger({ piece }: { piece: Piece }) {
  const cloth = getCloth(piece.cloth)!;

  return (
    <section aria-labelledby="proof" className="flex flex-col gap-6">
      <SpecHeading id="proof" number="01">
        Proof
      </SpecHeading>
      <p className="type-lede max-w-[52ch]">{cloth.intro}</p>
      <dl className="border-t border-foreground">
        {piece.proof.map((row, index) => (
          <div
            key={row.label}
            className="grid gap-x-4 gap-y-1 border-b border-border py-3 md:grid-cols-[minmax(12rem,2fr)_3fr]">
            <dt className="flex items-baseline gap-4">
              <span className="type-caption w-10 shrink-0 text-muted-foreground" aria-hidden="true">
                P.{String(index + 1).padStart(2, "0")}
              </span>
              <span className="type-label">{row.label}</span>
              <span
                aria-hidden="true"
                className="hidden min-w-4 flex-1 self-end border-b border-dotted border-input/60 md:mb-1 md:block"
              />
            </dt>
            <dd className="type-proof pl-14 whitespace-pre-line md:pl-0">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
