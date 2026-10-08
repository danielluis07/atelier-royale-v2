import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { LookTile } from "@/components/collection/look-tile";
import { PieceCard } from "@/components/collection/piece-card";
import { MillraceImage } from "@/components/millrace-image";
import { galleryViews } from "@/components/piece/gallery-views";
import { PieceView, type ColorwayMedia } from "@/components/piece/piece-view";
import { ProofLedger } from "@/components/piece/proof-ledger";
import { SmallPrint } from "@/components/piece/small-print";
import { SpecHeading } from "@/components/piece/spec-heading";
import {
  getCategory,
  getCloth,
  getCollection,
  getPiece,
  getRelatedPieces,
  getWornIn,
  type Piece,
} from "@/lib/catalog";

// Every Piece is prerendered, so navigations to them never wait. Only an
// unknown slug blocks, on purpose: the params are read outside Suspense so
// notFound() still answers with a real 404 status.
export const instant = false;

export function generateStaticParams() {
  return getCollection().map((piece) => ({ slug: piece.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const piece = getPiece((await params).slug);
  if (!piece) return {};
  return {
    title: piece.name,
    description: `${piece.story} Material: ${getCloth(piece.cloth)!.name}. Peça feita em Hollins Weir.`,
  };
}

export default async function PiecePage({ params }: PageProps<"/shop/[slug]">) {
  const piece = getPiece((await params).slug);
  if (!piece) notFound();

  const category = getCategory(piece.category)!;
  const wornIn = getWornIn(piece.id);
  const related = getRelatedPieces(piece.id);

  return (
    <div className="mx-auto w-full max-w-[1536px] px-4 pt-6 pb-24 md:px-8 md:pt-8 lg:px-12 lg:pb-32">
      <PieceView
        piece={piece}
        sizes={category.sizes}
        media={galleryMedia(piece)}
        smallPrint={<SmallPrint category={piece.category} />}>
        <ProofLedger piece={piece} />
      </PieceView>

      <SpecSection number="02" title="Esta peça nos looks">
        <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
          {wornIn.map((look) => (
            <li key={look.id}>
              <LookTile look={look} />
            </li>
          ))}
        </ul>
      </SpecSection>

      {related.length > 0 && (
        <SpecSection number="03" title="Peças relacionadas">
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
            {related.map((entry) => (
              <li key={entry.id}>
                <PieceCard piece={entry} />
              </li>
            ))}
          </ul>
        </SpecSection>
      )}
    </div>
  );
}

// Images render here, on the server, so their metadata never ships as
// JavaScript; the client only picks the Colourway and view to show. The first
// view is the main image, the only high-priority image on the page.
function galleryMedia(piece: Piece): Record<string, ColorwayMedia> {
  return Object.fromEntries(
    piece.colorways.map((colorway) => [
      colorway.id,
      {
        slides: galleryViews.map((view, index) => (
          <MillraceImage
            key={colorway.images[view.image]}
            imageKey={colorway.images[view.image]}
            slot={index === 0 ? "piece-main" : "piece-gallery"}
            alt={`${piece.name} na cor ${colorway.name}, ${view.label.toLowerCase()}`}
          />
        )),
        thumbnails: galleryViews.map((view) => (
          <MillraceImage
            key={colorway.images[view.image]}
            imageKey={colorway.images[view.image]}
            slot="piece-thumbnail"
            alt=""
          />
        )),
        lightbox: galleryViews.map((view) => (
          <MillraceImage
            key={colorway.images[view.image]}
            imageKey={colorway.images[view.image]}
            slot="lightbox"
            alt={`${piece.name} na cor ${colorway.name}, ${view.label.toLowerCase()}`}
          />
        )),
      },
    ]),
  );
}

/** A full-width spec-sheet section below the gallery and buy panel. */
function SpecSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  const id = `section-${number}`;
  return (
    <section aria-labelledby={id} className="mt-24 flex flex-col gap-8 border-t border-border pt-6 lg:mt-32">
      <SpecHeading id={id} number={number}>
        {title}
      </SpecHeading>
      {children}
    </section>
  );
}
