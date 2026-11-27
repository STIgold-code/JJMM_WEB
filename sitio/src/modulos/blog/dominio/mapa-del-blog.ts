import { RUTA_DEL_BLOG, rutaDeCategoria, rutaDeEtiqueta, rutaDePublicacion } from './rutas-del-blog'

// Lo que el sitemap necesita de una publicación publicada: slugs y fecha de actualización.
export interface PublicacionDelMapa {
  slug: string
  // ISO 8601.
  actualizadaEn: string
  categoria: string | null
  etiquetas: readonly string[]
}

export interface RutaDelMapa {
  ruta: string
  // ISO 8601 o null si no hay una fecha que informar.
  ultimaModificacion: string | null
}

// Las fechas ISO 8601 en UTC se ordenan como texto.
const masReciente = (a: string | undefined, b: string): string => (a && a > b ? a : b)

function agregarFecha(fechas: Map<string, string>, ruta: string, fecha: string): void {
  fechas.set(ruta, masReciente(fechas.get(ruta), fecha))
}

const aRutas = (fechas: Map<string, string>): RutaDelMapa[] =>
  [...fechas].map(([ruta, ultimaModificacion]) => ({ ruta, ultimaModificacion }))

// /blog, cada publicación, y las categorías y etiquetas que tienen publicaciones. Cada
// listado toma la fecha de su publicación más reciente; sin publicaciones, /blog va sin fecha.
export function rutasDelMapaDelBlog(publicaciones: readonly PublicacionDelMapa[]): RutaDelMapa[] {
  const detalle = new Map<string, string>()
  const categorias = new Map<string, string>()
  const etiquetas = new Map<string, string>()
  let blog: string | null = null
  for (const { slug, actualizadaEn, categoria, etiquetas: slugs } of publicaciones) {
    blog = masReciente(blog ?? undefined, actualizadaEn)
    agregarFecha(detalle, rutaDePublicacion(slug), actualizadaEn)
    if (categoria) agregarFecha(categorias, rutaDeCategoria(categoria), actualizadaEn)
    for (const etiqueta of slugs) agregarFecha(etiquetas, rutaDeEtiqueta(etiqueta), actualizadaEn)
  }
  return [
    { ruta: RUTA_DEL_BLOG, ultimaModificacion: blog },
    ...aRutas(detalle),
    ...aRutas(categorias),
    ...aRutas(etiquetas),
  ]
}
