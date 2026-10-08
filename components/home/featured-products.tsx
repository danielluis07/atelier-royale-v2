import { randomInt } from "node:crypto";
import { connection } from "next/server";
import { Suspense } from "react";
import { PieceCard } from "@/components/collection/piece-card";
import { getCollection } from "@/lib/catalog";

const rowClassName = "mt-8 grid auto-cols-[75%] grid-flow-col snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain p-1 pb-4 md:auto-cols-[40%] md:gap-5 xl:auto-cols-auto xl:grid-cols-4 xl:gap-6 xl:overflow-visible";

async function RandomProducts() {
  // Select at request time so the static shell never freezes the selection.
  await connection();
  const pieces = [...getCollection()];

  // Fisher–Yates samples without duplicates and leaves the catalog untouched.
  for (let index = pieces.length - 1; index > 0; index--) {
    const other = randomInt(index + 1);
    [pieces[index], pieces[other]] = [pieces[other], pieces[index]];
  }

  return (
    <ul className={rowClassName}>
      {pieces.slice(0, 4).map((piece) => (
        <li key={piece.id} className="min-w-0 snap-start">
          <PieceCard piece={piece} imageSlot="featured-product-card" />
        </li>
      ))}
    </ul>
  );
}

function ProductsPlaceholder() {
  return (
    <div className={rowClassName} aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index}>
          <div className="aspect-square bg-stone" />
          <div className="mt-3 h-4 w-1/2 bg-stone" />
          <div className="mt-2 h-6 w-3/4 bg-stone" />
          <div className="mt-1 h-5 w-1/3 bg-stone" />
        </div>
      ))}
    </div>
  );
}

export function FeaturedProducts() {
  return (
    <section aria-labelledby="featured-products" className="mx-auto w-full max-w-[1536px] px-4 py-16 md:px-8 md:py-24 lg:px-12">
      <h2 id="featured-products" className="type-h2">Featured pieces</h2>
      <Suspense fallback={<ProductsPlaceholder />}>
        <RandomProducts />
      </Suspense>
    </section>
  );
}
