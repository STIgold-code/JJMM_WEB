import type { Metadata } from 'next'

import type { DatosDelSitio } from '@/compartido/aplicacion/obtener-datos-del-sitio'

const LOCALIDAD = 'es_PE'

// Open Graph del sitio. Una página que define su propio `openGraph` reemplaza este objeto
// entero (Next no los combina), por eso el inicio lo repite con su URL.
const openGraphDelSitio = ({ marca, seo }: DatosDelSitio): Metadata['openGraph'] => ({
  type: 'website',
  siteName: marca.nombreComercial,
  locale: LOCALIDAD,
  title: seo.titulo,
  description: seo.descripcion,
})

// Metadatos que heredan todas las páginas públicas. `metadataBase` vuelve absolutas las URL
// relativas (canonical, Open Graph). Cada página define su propio título y la plantilla le
// agrega el nombre comercial. Sin configuración guardada, solo la base.
export function metadatosPorDefecto(origen: URL, datos: DatosDelSitio | null): Metadata {
  if (!datos) return { metadataBase: origen }
  const { seo, marca } = datos
  return {
    metadataBase: origen,
    title: { default: seo.titulo, template: `%s | ${marca.nombreComercial}` },
    description: seo.descripcion,
    openGraph: openGraphDelSitio(datos),
  }
}

const RUTA_DE_INICIO = '/'

export function metadatosDeInicio(datos: DatosDelSitio | null): Metadata {
  const canonical = { alternates: { canonical: RUTA_DE_INICIO } }
  if (!datos) return canonical
  return { ...canonical, openGraph: { ...openGraphDelSitio(datos), url: RUTA_DE_INICIO } }
}
