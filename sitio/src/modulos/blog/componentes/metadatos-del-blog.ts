import type { Metadata } from 'next'

import type { Imagen } from '@/compartido/dominio/imagen'

import type { DetalleDePublicacion, PaginaDelBlog } from '../dominio/publicacion'
import { RUTA_DEL_BLOG, rutaDePagina, rutaDePublicacion } from '../dominio/rutas-del-blog'

// Metadatos de las páginas del blog. Las URL son relativas: el layout define la base
// (metadataBase) para volverlas absolutas. Lo que queda sin definir se hereda del layout.

const tituloDePagina = (titulo: string, pagina: number): string =>
  pagina > 1 ? `${titulo} (página ${pagina})` : titulo

interface DatosDeListado {
  titulo: string
  descripcion: string | null
  rutaBase: string
  pagina: number
}

export function metadatosDeListado({
  titulo,
  descripcion,
  rutaBase,
  pagina,
}: DatosDeListado): Metadata {
  const url = rutaDePagina(rutaBase, pagina)
  const tituloFinal = tituloDePagina(titulo, pagina)
  return {
    title: tituloFinal,
    ...(descripcion ? { description: descripcion } : {}),
    alternates: { canonical: url },
    openGraph: { type: 'website', title: tituloFinal, url },
  }
}

export function metadatosDelBlog(pagina: PaginaDelBlog, numero: number): Metadata {
  return metadatosDeListado({
    titulo: pagina.seo.titulo ?? pagina.titulo,
    descripcion: pagina.seo.descripcion ?? pagina.introduccion,
    rutaBase: RUTA_DEL_BLOG,
    pagina: numero,
  })
}

const imagenesDe = (imagen: Imagen | null) =>
  imagen
    ? [{ url: imagen.url, width: imagen.ancho, height: imagen.alto, alt: imagen.alt }]
    : undefined

export function metadatosDePublicacion(publicacion: DetalleDePublicacion<unknown>): Metadata {
  const titulo = publicacion.seo.titulo ?? publicacion.titulo
  const descripcion = publicacion.seo.descripcion ?? publicacion.extracto
  const url = rutaDePublicacion(publicacion.slug)
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: titulo,
      description: descripcion,
      url,
      publishedTime: publicacion.fechaDePublicacion,
      images: imagenesDe(publicacion.imagen),
    },
  }
}
