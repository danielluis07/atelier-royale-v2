import { categories, cloths, lookbook, pieces } from "./data";
import type {
  CategoryId,
  ClothId,
  CollectionFilter,
  Look,
  Piece,
  SearchResult,
} from "./types";

export type {
  Category,
  CategoryId,
  Cloth,
  ClothId,
  CollectionFilter,
  CollectionSort,
  Colorway,
  ImageAspect,
  Interstitial,
  Look,
  Lookbook,
  LookbookCover,
  Piece,
  ProofLabel,
  ProofRow,
  SearchResult,
  Size,
  SizeGuide,
} from "./types";

// Public results are immutable even for JavaScript callers. Pages cannot change
// the shared catalog or leak a change into a later prerender or browser query.
function freeze(value: object): void {
  for (const child of Object.values(value)) {
    if (child !== null && typeof child === "object" && !Object.isFrozen(child))
      freeze(child);
  }
  Object.freeze(value);
}

for (const data of [categories, cloths, pieces, lookbook]) freeze(data);

export function getCategories() {
  return categories;
}

export function getCategory(id: CategoryId) {
  return categories.find((category) => category.id === id);
}

export function getCloths() {
  return cloths;
}

export function getCloth(id: ClothId) {
  return cloths.find((cloth) => cloth.id === id);
}

export function getPiece(id: string): Piece | undefined {
  return pieces.find((piece) => piece.id === id);
}

/** Groups intersect. Size must be available in the matching Colourway. */
export function getCollection(filter: CollectionFilter = {}): readonly Piece[] {
  const color = filter.color?.trim().toLowerCase();
  const result = pieces.filter((piece) => {
    if (filter.category && piece.category !== filter.category) return false;
    if (filter.cloth && piece.cloth !== filter.cloth) return false;
    const category = getCategory(piece.category)!;
    if (filter.size && !category.sizes.includes(filter.size)) return false;
    return piece.colorways.some(
      (colorway) =>
        (!color ||
          colorway.id === color ||
          colorway.name.toLowerCase() === color) &&
        (!filter.size || !colorway.soldOutSizes.includes(filter.size)),
    );
  });
  result.sort((a, b) => {
    const priceOrder =
      filter.sort === "price-asc"
        ? a.price - b.price
        : filter.sort === "price-desc"
          ? b.price - a.price
          : 0;
    return (
      priceOrder ||
      a.featuredRank - b.featuredRank ||
      a.number.localeCompare(b.number)
    );
  });
  return Object.freeze(result);
}

export function getLookbook() {
  return lookbook;
}

export function getLooks(): readonly Look[] {
  return Object.freeze(
    lookbook.frames.filter((frame): frame is Look => frame.kind === "look"),
  );
}

/** Accept a Look id or the zero-padded number used in ?look=03 links. */
export function getLook(id: string): Look | undefined {
  return getLooks().find((look) => look.id === id || look.number === id);
}

export function getWornIn(pieceId: string): readonly Look[] {
  return Object.freeze(
    getLooks().filter((look) =>
      look.items.some((item) => item.piece === pieceId),
    ),
  );
}

export function getColorCount(pieceId: string): number {
  return getPiece(pieceId)?.colorways.length ?? 0;
}

export function getFeaturedPiece(): Piece {
  return getCollection()[0];
}

/** Same Category first, then same Cloth, in Featured order; at most 3. */
export function getRelatedPieces(pieceId: string): readonly Piece[] {
  const piece = getPiece(pieceId);
  if (!piece) return Object.freeze([]);
  const others = getCollection().filter(
    (candidate) => candidate.id !== pieceId,
  );
  return Object.freeze(
    [
      ...others.filter((candidate) => candidate.category === piece.category),
      ...others.filter(
        (candidate) =>
          candidate.category !== piece.category &&
          candidate.cloth === piece.cloth,
      ),
    ].slice(0, 3),
  );
}

/** Blank queries are idle. No matches suggest the first 3 navigation Categories. */
export function search(query: string): SearchResult {
  const term = query.trim().toLowerCase();
  if (!term)
    return Object.freeze({
      pieces: Object.freeze([]),
      suggestions: Object.freeze([]),
    });
  const matches = getCollection().filter((piece) =>
    [
      piece.name,
      getCategory(piece.category)!.name,
      getCloth(piece.cloth)!.name,
    ].some((value) => value.toLowerCase().includes(term)),
  );
  return Object.freeze({
    pieces: Object.freeze(matches),
    suggestions: Object.freeze(matches.length ? [] : categories.slice(0, 3)),
  });
}
