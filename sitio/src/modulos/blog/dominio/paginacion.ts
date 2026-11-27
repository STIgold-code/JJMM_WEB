// Paginación de los listados del blog (/blog, categoría y etiqueta) con ?pagina=N.
export const PUBLICACIONES_POR_PAGINA = 9

// Solo enteros positivos sin ceros a la izquierda: así cada página tiene una sola URL.
const PATRON_DE_PAGINA = /^[1-9]\d*$/

export interface Paginacion {
  pagina: number
  totalDePaginas: number
  anterior: number | null
  siguiente: number | null
}

// Sin parámetro es la primera página; un valor que no es página da null (la ruta responde 404).
export function leerNumeroDePagina(valor: string | readonly string[] | undefined): number | null {
  if (valor === undefined) return 1
  if (typeof valor !== 'string' || !PATRON_DE_PAGINA.test(valor)) return null
  return Number(valor)
}

// Sin publicaciones hay una página vacía. Una página fuera de rango da null.
export function calcularPaginacion(
  total: number,
  pagina: number,
  porPagina: number,
): Paginacion | null {
  const totalDePaginas = Math.max(1, Math.ceil(total / porPagina))
  if (pagina > totalDePaginas) return null
  return {
    pagina,
    totalDePaginas,
    anterior: pagina > 1 ? pagina - 1 : null,
    siguiente: pagina < totalDePaginas ? pagina + 1 : null,
  }
}
