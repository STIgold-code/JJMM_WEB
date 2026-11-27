// Etiquetas de la caché de lecturas públicas. Cada lectura se guarda con las etiquetas de lo
// que lee, y cada cambio en el panel invalida las suyas. Son cadenas puras: las comparten los
// adaptadores (al leer) y los hooks de Payload (al invalidar).

export const etiquetaDeColeccion = (coleccion: string): string => `coleccion:${coleccion}`

export const etiquetaDeGlobal = (global: string): string => `global:${global}`

// Un documento que se lee solo, por su slug (el detalle de una publicación), lleva su propia
// etiqueta: así cambiar una publicación no invalida el detalle de las demás.
export const etiquetaDeDocumento = (coleccion: string, slug: string): string =>
  `documento:${coleccion}:${slug}`

const COLECCIONES_CON_ETIQUETA_POR_DOCUMENTO: ReadonlySet<string> = new Set(['publicaciones'])

const esSlug = (valor: string | null | undefined): valor is string =>
  typeof valor === 'string' && valor.length > 0

// Etiquetas que invalida un cambio en una colección. `slugs` reúne el slug nuevo y el que era
// público antes: si el slug cambió, la URL anterior también debe dejar de servir lo viejo.
export function etiquetasDeCambioEnColeccion(
  coleccion: string,
  slugs: readonly (string | null | undefined)[],
): string[] {
  const deLaColeccion = etiquetaDeColeccion(coleccion)
  if (!COLECCIONES_CON_ETIQUETA_POR_DOCUMENTO.has(coleccion)) return [deLaColeccion]
  const unicos = new Set(slugs.filter(esSlug))
  return [deLaColeccion, ...[...unicos].map((slug) => etiquetaDeDocumento(coleccion, slug))]
}

export interface CambioConBorradores {
  // `_status` del documento que resulta del cambio.
  estadoNuevo: unknown
  // Si el documento era público justo antes del cambio.
  estabaPublicada: boolean
}

// En una colección con borradores, un cambio afecta al sitio si el documento queda publicado
// o si era público antes (despublicar). Guardar un borrador de algo que nunca fue público no
// toca nada de lo que ve el visitante.
export const cambiaLoPublico = ({ estadoNuevo, estabaPublicada }: CambioConBorradores): boolean =>
  estadoNuevo === 'published' || estabaPublicada
