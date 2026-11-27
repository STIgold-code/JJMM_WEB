// «Publicaciones similares»: otras de la misma categoría, las más recientes primero.
export const MAXIMO_DE_SIMILARES = 3

// El repositorio pide una más que el máximo, porque la actual puede venir entre ellas.
export const CANDIDATAS_A_SIMILARES = MAXIMO_DE_SIMILARES + 1

export function seleccionarSimilares<P extends { slug: string }>(
  slugActual: string,
  candidatas: readonly P[],
): P[] {
  return candidatas.filter(({ slug }) => slug !== slugActual).slice(0, MAXIMO_DE_SIMILARES)
}
