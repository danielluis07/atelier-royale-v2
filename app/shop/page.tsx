import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionFallback, CollectionFromUrl } from "@/components/collection/collection-view";
import { LookTile } from "@/components/collection/look-tile";
import { PieceCard } from "@/components/collection/piece-card";
import { getCollection, getLook } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Every Piece by Category or Cloth: jackets, shirts, trousers, knitwear and boots, cut and sewn at Hollins Weir.",
};

// One Collection template for all Pieces, one Category or one Cloth. The shell
// is prerendered; the filters live in the URL, so the view reads them on the
// client inside Suspense. Cards render here, on the server, and the client
// only chooses which to show, so image metadata never ships as JavaScript.
export default function ShopPage() {
  const cards = Object.fromEntries(
    getCollection().map((piece) => [piece.id, <PieceCard key={piece.id} piece={piece} morph />]),
  );
  const lookTile = <LookTile look={getLook("01")!} />;

  return (
    <Suspense fallback={<CollectionFallback cards={cards} lookTile={lookTile} />}>
      <CollectionFromUrl cards={cards} lookTile={lookTile} />
    </Suspense>
  );
}
