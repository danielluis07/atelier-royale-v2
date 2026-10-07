/** USD, whole dollars without cents (DESIGN.md §3): `$480`, `$1,240`. */
export function formatPrice(dollars: number): string {
  return `$${dollars.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

/** Colour counts as numerals (DESIGN.md §8): `1 colour`, `3 colours`. */
export function formatColorCount(count: number): string {
  return `${count} ${count === 1 ? "colour" : "colours"}`;
}

export function formatPieceCount(count: number): string {
  return `${count} ${count === 1 ? "Piece" : "Pieces"}`;
}
