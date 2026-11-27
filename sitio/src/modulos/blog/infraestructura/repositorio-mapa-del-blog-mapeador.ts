import type { Publicacione } from '@/payload-types'

import type { PublicacionDelMapa } from '../dominio/mapa-del-blog'

// Campos que pide el sitemap: sin contenido, extracto ni imagen.
export const CAMPOS_DEL_MAPA = {
  slug: true,
  updatedAt: true,
  categoria: true,
  etiquetas: true,
} as const

// De las relaciones solo hace falta el slug.
export const RELACIONES_DEL_MAPA = {
  categorias: { slug: true },
  etiquetas: { slug: true },
} as const

type DocumentoDelMapa = Pick<Publicacione, keyof typeof CAMPOS_DEL_MAPA>

// Una relación sin poblar (solo el id) se trata como ausente.
const slugDe = (relacion: number | { slug: string } | null | undefined): string | null =>
  typeof relacion === 'object' && relacion !== null ? relacion.slug : null

export function mapearPublicacionDelMapa(publicacion: DocumentoDelMapa): PublicacionDelMapa {
  return {
    slug: publicacion.slug,
    actualizadaEn: publicacion.updatedAt,
    categoria: slugDe(publicacion.categoria),
    etiquetas: (publicacion.etiquetas ?? [])
      .map(slugDe)
      .filter((slug): slug is string => slug !== null),
  }
}
