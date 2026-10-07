import Link from "next/link";
import { ViewTransition } from "react";
import { MillraceImage } from "@/components/millrace-image";
import { pieceMorphName } from "@/components/piece/gallery-views";
import { ProofRows } from "@/components/piece/proof-ledger";
import { buttonVariants } from "@/components/ui/button";
import { getFeaturedPiece } from "@/lib/catalog";
import { formatColorCount, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

/** How much of the Proof Home shows (DESIGN.md §6 Proof ledger). */
const proofSlice = 3;

// The featured Piece (lowest featured rank: the Field Jacket), set spec-sheet
// style: the still life the Piece page opens on, which morphs into its main
// image (DESIGN.md §5), beside the number, name, price and a slice of the
// Proof ledger. Same columns and image size as the Piece page.
export function FeaturedPiece() {
  const piece = getFeaturedPiece();
  const [colorway] = piece.colorways;
  const href = routes.piece(piece.id);

  return (
    <section aria-labelledby="featured-piece" className="border-y border-border">
      <div className="mx-auto grid w-full max-w-[1536px] gap-8 px-4 py-16 md:grid-cols-2 md:gap-5 md:px-8 md:py-24 lg:px-12 xl:gap-6">
        {/* The image repeats the Proof link for pointers, so it stays out of
            the tab order and the accessibility tree. */}
        <Link href={href} tabIndex={-1} aria-hidden="true">
          <ViewTransition name={pieceMorphName(piece.id)} share="piece-morph" default="none">
            <MillraceImage imageKey={colorway.images.still} slot="home-featured" alt="" />
          </ViewTransition>
        </Link>

        <div className="flex flex-col gap-6 md:py-2 lg:pl-[calc(100%/6)]">
          <p className="type-label text-muted-foreground">Featured Piece</p>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="type-caption">No. {piece.number}</span>
              <span className="type-price">{formatPrice(piece.price)}</span>
            </div>
            <h2 id="featured-piece" className="type-h1">{piece.name}</h2>
            <p className="type-body-sm text-muted-foreground">
              {formatColorCount(piece.colorways.length)}
            </p>
          </div>
          <p className="type-lede max-w-[36ch]">{piece.story}</p>
          <ProofRows rows={piece.proof.slice(0, proofSlice)} />
          <Link href={href} className={cn(buttonVariants({ variant: "link" }), "self-start")}>
            Read the Proof
            <span className="sr-only">, {piece.name}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
