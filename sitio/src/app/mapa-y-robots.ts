import type { MetadataRoute } from 'next'

import { urlAbsoluta } from '@/compartido/dominio/url-del-sitio'
import type { RutaDelMapa } from '@/modulos/blog/dominio/mapa-del-blog'

// Páginas públicas fuera del blog. Su contenido vive en globales del panel sin fecha útil
// para el sitemap, así que van sin `lastModified`.
export const RUTAS_FIJAS_DEL_MAPA: readonly RutaDelMapa[] = [
  { ruta: '/', ultimaModificacion: null },
  { ruta: '/guia', ultimaModificacion: null },
]

export function entradasDelMapa(origen: URL, rutas: readonly RutaDelMapa[]): MetadataRoute.Sitemap {
  return rutas.map(({ ruta, ultimaModificacion }) => ({
    url: urlAbsoluta(origen, ruta),
    ...(ultimaModificacion ? { lastModified: ultimaModificacion } : {}),
  }))
}

// El panel y la API quedan fuera del índice, salvo los archivos de medios: las imágenes de
// las publicaciones se sirven desde /api/medios/file/.
export function reglasDeRobots(origen: URL): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: ['/', '/api/medios/file/'], disallow: ['/admin', '/api'] }],
    sitemap: urlAbsoluta(origen, '/sitemap.xml'),
  }
}
