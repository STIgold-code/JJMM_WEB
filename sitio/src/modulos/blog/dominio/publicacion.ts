import type { Imagen } from '@/compartido/dominio/imagen'

// Colores de etiqueta: lista cerrada, cada uno con su par de colores AA en el CSS.
export const COLORES_DE_ETIQUETA = ['azul', 'verde', 'rojo', 'amarillo', 'morado', 'gris'] as const
export type ColorDeEtiqueta = (typeof COLORES_DE_ETIQUETA)[number]

export interface Categoria {
  nombre: string
  slug: string
}

export interface Etiqueta {
  nombre: string
  slug: string
  color: ColorDeEtiqueta
}

// Lo que muestra una tarjeta del listado. `fechaDePublicacion` es ISO 8601.
export interface ResumenDePublicacion {
  titulo: string
  slug: string
  extracto: string
  imagen: Imagen | null
  categoria: Categoria | null
  etiquetas: readonly Etiqueta[]
  fechaDePublicacion: string
}

export interface SeoDePublicacion {
  titulo: string | null
  descripcion: string | null
}

// El contenido enriquecido es opaco para el dominio: solo la capa de interfaz lo dibuja.
export interface DetalleDePublicacion<Contenido> extends ResumenDePublicacion {
  // Última vez que se guardó en el panel (ISO 8601): `dateModified` y Open Graph.
  fechaDeActualizacion: string
  contenido: Contenido
  seo: SeoDePublicacion
}

// Textos del listado /blog, editados en la global `pagina-del-blog`.
export interface PaginaDelBlog {
  titulo: string
  introduccion: string | null
  textoSinPublicaciones: string
  seo: SeoDePublicacion
}
