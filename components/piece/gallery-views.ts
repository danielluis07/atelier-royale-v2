import type { Colorway } from "@/lib/catalog";

/** The four squares per Colourway, in order (DESIGN.md §6 Piece page). */
export const galleryViews: readonly {
  readonly image: keyof Colorway["images"];
  readonly label: string;
}[] = [
  { image: "still", label: "Still life" },
  { image: "front", label: "On body, front" },
  { image: "back", label: "On body, back" },
  { image: "detail", label: "Detail" },
];

/**
 * The shared-element name that morphs a Collection card's image into the
 * Piece main image (DESIGN.md §5).
 */
export function pieceMorphName(pieceId: string): string {
  return `piece-${pieceId}`;
}
