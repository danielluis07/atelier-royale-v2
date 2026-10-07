import Link from "next/link";
import { MillraceImage } from "@/components/millrace-image";
import { Badge } from "@/components/ui/badge";
import type { Piece } from "@/lib/catalog";
import { formatColorCount, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";

// DESIGN.md §6 Piece card: a square still life on stone, then number and
// price, name, colour count. On a desktop pointer, hover (or keyboard focus)
// crossfades to the on-body front shot. The front shot is not rendered on
// touch screens, so it is never downloaded there.
export function PieceCard({ piece }: { piece: Piece }) {
  const [colorway] = piece.colorways;

  return (
    <Link href={routes.piece(piece.id)} className="group flex flex-col">
      <div className="relative">
        <MillraceImage imageKey={colorway.images.still} slot="collection-card" alt="" />
        <MillraceImage
          imageKey={colorway.images.front}
          slot="collection-card"
          alt=""
          className="absolute! inset-0 hidden opacity-0 transition-opacity duration-(--dur-base) ease-mech can-hover:block can-hover:group-hover:opacity-100 can-hover:group-focus-visible:opacity-100"
        />
        {piece.badge && (
          <Badge className="absolute top-3 left-3">{piece.badge}</Badge>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="type-caption">No. {piece.number}</span>
        <span className="type-price">{formatPrice(piece.price)}</span>
      </div>
      <span className="mt-2 font-medium">{piece.name}</span>
      <span className="type-body-sm text-muted-foreground">
        {formatColorCount(piece.colorways.length)}
      </span>
    </Link>
  );
}
