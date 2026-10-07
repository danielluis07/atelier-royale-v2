import { getCategory, getPiece, type Look, type Lookbook, type Size } from "@/lib/catalog";

type Frame = Lookbook["frames"][number];

/** The Look a frame counts as: Interstitials keep the Look before them and the cover counts as the first. */
export function lookIndexAt(frames: readonly Frame[], frameIndex: number): number {
  let index = 0;
  for (const frame of frames.slice(0, frameIndex + 1)) {
    if (frame.kind === "look") index++;
  }
  return Math.max(index, 1);
}

/**
 * The shared-element name that morphs a Home teaser frame into the same
 * Look's frame in the Lookbook (DESIGN.md §5).
 */
export function lookMorphName(number: string): string {
  return `look-${number}`;
}

/** The counter, zero-padded: `03 / 08`. */
export function formatCounter(index: number, total: number): string {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(index)} / ${pad(total)}`;
}

/** Texto anunciado depois de avançar ou voltar: "Look 3 de 8". */
export function describePosition(index: number, total: number): string {
  return `Look ${index} de ${total}`;
}

/** Alt text from what the Look is wearing, in the Colourways worn. */
export function lookAlt(look: Look): string {
  const worn = look.items.map(({ piece: pieceId, colorway: colorwayId }) => {
    const piece = getPiece(pieceId)!;
    const colorway = piece.colorways.find((entry) => entry.id === colorwayId)!;
    return `${piece.name} in ${colorway.name}`;
  });
  const list =
    worn.length > 1
      ? `${worn.slice(0, -1).join(", ")} and ${worn.at(-1)}`
      : worn.join("");
  return `Look ${look.number} em Hollins Weir: ${list}.`;
}

// Snap maths for the strip. `targets` are the scroll positions at which each
// frame snaps, already clamped to the strip's scroll range, so frames near the
// end can share a target. Steps move between distinct targets: one snap.

const tolerance = 2;

/** The last frame whose snap position has been reached. */
export function currentFrame(targets: readonly number[], scrollLeft: number): number {
  let current = 0;
  targets.forEach((target, index) => {
    if (target <= scrollLeft + tolerance) current = index;
  });
  return current;
}

/** The scroll position one snap away, or undefined at either end. */
export function stepTarget(
  targets: readonly number[],
  scrollLeft: number,
  direction: 1 | -1,
): { frame: number; left: number } | undefined {
  const left =
    direction === 1
      ? targets.find((target) => target > scrollLeft + tolerance)
      : targets.findLast((target) => target < scrollLeft - tolerance);
  // Frames sharing a target count as the last of them, as currentFrame does.
  return left === undefined ? undefined : { frame: targets.lastIndexOf(left), left };
}

/** One Piece as the Look panel lists it: in the exact Colourway the Look wears. */
export interface LookPiece {
  readonly id: string;
  readonly number: string;
  readonly name: string;
  readonly price: number;
  readonly colourwayId: string;
  readonly colourwayName: string;
  /** The Category's sizes, sold-out ones in this Colourway marked. */
  readonly sizes: readonly { readonly size: Size; readonly soldOut: boolean }[];
}

/** What the Look panel lists, in the order the Look is worn. */
export function lookPieces(look: Look): readonly LookPiece[] {
  return look.items.map(({ piece: pieceId, colorway: colorwayId }) => {
    const piece = getPiece(pieceId)!;
    const colorway = piece.colorways.find((entry) => entry.id === colorwayId)!;
    return {
      id: piece.id,
      number: piece.number,
      name: piece.name,
      price: piece.price,
      colourwayId: colorway.id,
      colourwayName: colorway.name,
      sizes: getCategory(piece.category)!.sizes.map((size) => ({
        size,
        soldOut: colorway.soldOutSizes.includes(size),
      })),
    };
  });
}

/** The cart line a quick add makes, or nothing for a size the Colourway can't sell. */
export function quickAddLine(
  piece: LookPiece,
  size: string,
): { pieceId: string; colourwayId: string; size: string } | undefined {
  const entry = piece.sizes.find((option) => option.size === size);
  if (!entry || entry.soldOut) return undefined;
  return { pieceId: piece.id, colourwayId: piece.colourwayId, size };
}

/** Texto do botão depois de adicionar: "Adicionado · M". */
export function addedLabel(size: string): string {
  return `Adicionado · ${size}`;
}

/** Texto anunciado depois de uma adição rápida. */
export function describeQuickAdd(piece: Pick<LookPiece, "name">, size: string): string {
  return `Adicionado: ${piece.name}, ${size}`;
}
