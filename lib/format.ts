/** USD, whole dollars without cents (DESIGN.md §3): `$480`, `$1,240`. */
export function formatPrice(dollars: number): string {
  return `$${dollars.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
}

/** Contagem de cores em algarismos: `1 cor`, `3 cores`. */
export function formatColorCount(count: number): string {
  return `${count} ${count === 1 ? "cor" : "cores"}`;
}

export function formatPieceCount(count: number): string {
  return `${count} ${count === 1 ? "peça" : "peças"}`;
}
