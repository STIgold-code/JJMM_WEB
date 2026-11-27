import { CONTEXTO_SCHEMA_ORG, type Miga, type ObjetoJsonLd } from '@/compartido/dominio/json-ld'
import { urlAbsoluta } from '@/compartido/dominio/url-del-sitio'

import type { DetalleDePublicacion } from './publicacion'
import { RUTA_DEL_BLOG, rutaDeCategoria, rutaDePublicacion } from './rutas-del-blog'

// schema.org de una publicación: BlogPosting y sus migas (BreadcrumbList). Todo sale del
// panel; lo que no existe (imagen, categoría, etiquetas, logo) no se publica.

export interface EstudioQuePublica {
  nombre: string
  logo: string | null
}

const IDIOMA = 'es-PE'

function organizacion(origen: URL, estudio: EstudioQuePublica): ObjetoJsonLd {
  return {
    '@type': 'Organization',
    name: estudio.nombre,
    url: urlAbsoluta(origen, '/'),
    ...(estudio.logo
      ? { logo: { '@type': 'ImageObject', url: urlAbsoluta(origen, estudio.logo) } }
      : {}),
  }
}

function clasificacion(publicacion: DetalleDePublicacion<unknown>): ObjetoJsonLd {
  const { categoria, etiquetas } = publicacion
  return {
    ...(categoria ? { articleSection: categoria.nombre } : {}),
    ...(etiquetas.length > 0 ? { keywords: etiquetas.map(({ nombre }) => nombre) } : {}),
  }
}

export function datosEstructuradosDePublicacion(
  origen: URL,
  publicacion: DetalleDePublicacion<unknown>,
  estudio: EstudioQuePublica,
): ObjetoJsonLd {
  const url = urlAbsoluta(origen, rutaDePublicacion(publicacion.slug))
  const editor = organizacion(origen, estudio)
  return {
    '@context': CONTEXTO_SCHEMA_ORG,
    '@type': 'BlogPosting',
    headline: publicacion.titulo,
    description: publicacion.seo.descripcion ?? publicacion.extracto,
    url,
    mainEntityOfPage: url,
    datePublished: publicacion.fechaDePublicacion,
    dateModified: publicacion.fechaDeActualizacion,
    inLanguage: IDIOMA,
    ...(publicacion.imagen ? { image: [urlAbsoluta(origen, publicacion.imagen.url)] } : {}),
    ...clasificacion(publicacion),
    author: editor,
    publisher: editor,
  }
}

export interface TextosDeMigas {
  nombreDelSitio: string
  tituloDelBlog: string
}

// Inicio › Blog › Categoría (si tiene) › Publicación.
export function migasDePublicacion(
  publicacion: DetalleDePublicacion<unknown>,
  { nombreDelSitio, tituloDelBlog }: TextosDeMigas,
): Miga[] {
  const { categoria } = publicacion
  return [
    { nombre: nombreDelSitio, ruta: '/' },
    { nombre: tituloDelBlog, ruta: RUTA_DEL_BLOG },
    ...(categoria ? [{ nombre: categoria.nombre, ruta: rutaDeCategoria(categoria.slug) }] : []),
    { nombre: publicacion.titulo, ruta: rutaDePublicacion(publicacion.slug) },
  ]
}
