/** BRL, whole reais without cents (DESIGN.md §3): `R$ 480`, `R$ 1.240`. */
export function formatPrice(reais: number): string {
  return `R$ ${reais.toLocaleString("pt-BR", {
    minimumFractionDigits: Number.isInteger(reais) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Contagem de cores em algarismos: `1 cor`, `3 cores`. */
export function formatColorCount(count: number): string {
  return `${count} ${count === 1 ? "cor" : "cores"}`;
}

export function formatPieceCount(count: number): string {
  return `${count} ${count === 1 ? "peça" : "peças"}`;
}
