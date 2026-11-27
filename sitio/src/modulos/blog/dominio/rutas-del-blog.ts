import { esSlugValido } from '@/compartido/dominio/slug'

// Rutas públicas del blog. Un solo lugar para armarlas: listados, enlaces y metadatos.
export const RUTA_DEL_BLOG = '/blog'

export const rutaDePublicacion = (slug: string): string => `${RUTA_DEL_BLOG}/${slug}`

export const rutaDeCategoria = (slug: string): string => `${RUTA_DEL_BLOG}/categoria/${slug}`

export const rutaDeEtiqueta = (slug: string): string => `${RUTA_DEL_BLOG}/etiqueta/${slug}`

// La primera página no lleva parámetro, así no hay dos URL para el mismo contenido.
export const rutaDePagina = (rutaBase: string, pagina: number): string =>
  pagina > 1 ? `${rutaBase}?pagina=${pagina}` : rutaBase

// Un segmento que no puede ser slug se descarta antes de consultar la base.
export const leerSlug = (valor: string): string | null => (esSlugValido(valor) ? valor : null)

const RUTA_POR_COLECCION: Record<string, (slug: string) => string> = {
  publicaciones: rutaDePublicacion,
  categorias: rutaDeCategoria,
  etiquetas: rutaDeEtiqueta,
}

// Enlaces internos del contenido enriquecido: solo documentos del blog con slug.
export function rutaDeDocumentoInterno(coleccion: string, slug: string | null): string | null {
  const armarRuta = RUTA_POR_COLECCION[coleccion]
  return armarRuta && slug ? armarRuta(slug) : null
}
