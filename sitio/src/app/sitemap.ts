import type { MetadataRoute } from 'next'

import { urlDelSitio } from '@/compartido/infraestructura/url-del-sitio-configurada'
import { listarRutasDelMapa } from '@/modulos/blog/componentes/obtener-blog'

import { entradasDelMapa, RUTAS_FIJAS_DEL_MAPA } from './mapa-y-robots'

// Se arma en cada petición, así la compilación no necesita base de datos. La lista de
// publicaciones sale de la caché de datos con las etiquetas del blog: publicar o despublicar
// en el panel la invalida y una publicación nueva aparece sin volver a desplegar.
export const dynamic = 'force-dynamic'

// /sitemap.xml: inicio, guía y blog con sus publicaciones publicadas, categorías y etiquetas.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const rutasDelBlog = await listarRutasDelMapa()
  return entradasDelMapa(urlDelSitio(), [...RUTAS_FIJAS_DEL_MAPA, ...rutasDelBlog])
}
