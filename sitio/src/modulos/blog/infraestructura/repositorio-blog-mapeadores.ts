import { aImagen } from '@/compartido/infraestructura/imagen-de-medio'
import type {
  Categoria as CategoriaPayload,
  Etiqueta as EtiquetaPayload,
  PaginaDelBlog as PaginaDelBlogPayload,
  Publicacione,
} from '@/payload-types'

import type {
  Categoria,
  DetalleDePublicacion,
  Etiqueta,
  PaginaDelBlog,
  ResumenDePublicacion,
  SeoDePublicacion,
} from '../dominio/publicacion'

// Traducen los documentos de Payload a los tipos del dominio del blog.

export type ContenidoDePublicacion = Publicacione['contenido']

// Campos que pide el listado: todo menos el contenido, que puede ser largo.
export const CAMPOS_DEL_RESUMEN = {
  titulo: true,
  slug: true,
  extracto: true,
  imagen: true,
  categoria: true,
  etiquetas: true,
  fechaDePublicacion: true,
} as const

type DocumentoDelResumen = Pick<Publicacione, keyof typeof CAMPOS_DEL_RESUMEN>

const estaPoblado = <T extends object>(valor: number | T | null | undefined): valor is T =>
  typeof valor === 'object' && valor !== null

export function mapearCategoria(categoria: CategoriaPayload): Categoria {
  return { nombre: categoria.nombre, slug: categoria.slug }
}

export function mapearEtiqueta(etiqueta: EtiquetaPayload): Etiqueta {
  return { nombre: etiqueta.nombre, slug: etiqueta.slug, color: etiqueta.color }
}

// Una relación sin poblar (solo el id) se trata como ausente.
export function mapearResumen(publicacion: DocumentoDelResumen): ResumenDePublicacion {
  const { categoria, etiquetas } = publicacion
  return {
    titulo: publicacion.titulo,
    slug: publicacion.slug,
    extracto: publicacion.extracto,
    imagen: aImagen(publicacion.imagen),
    categoria: estaPoblado(categoria) ? mapearCategoria(categoria) : null,
    etiquetas: (etiquetas ?? []).filter(estaPoblado).map(mapearEtiqueta),
    fechaDePublicacion: publicacion.fechaDePublicacion,
  }
}

const textoONulo = (valor: string | null | undefined): string | null => valor?.trim() || null

function mapearSeo(seo: Publicacione['seo'] | PaginaDelBlogPayload['seo']): SeoDePublicacion {
  return { titulo: textoONulo(seo?.titulo), descripcion: textoONulo(seo?.descripcion) }
}

export function mapearDetalle(
  publicacion: Publicacione,
): DetalleDePublicacion<ContenidoDePublicacion> {
  return {
    ...mapearResumen(publicacion),
    contenido: publicacion.contenido,
    seo: mapearSeo(publicacion.seo),
  }
}

// Una global que nunca se guardó llega sin sus campos obligatorios.
type PaginaDelBlogGuardada = Partial<Omit<PaginaDelBlogPayload, 'id'>>

export function mapearPaginaDelBlog(guardada: PaginaDelBlogGuardada): PaginaDelBlog | null {
  const titulo = textoONulo(guardada.titulo)
  const textoSinPublicaciones = textoONulo(guardada.textoSinPublicaciones)
  if (!titulo || !textoSinPublicaciones) return null
  return {
    titulo,
    introduccion: textoONulo(guardada.introduccion),
    textoSinPublicaciones,
    seo: mapearSeo(guardada.seo),
  }
}
