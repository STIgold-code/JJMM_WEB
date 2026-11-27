import type { MetadataRoute } from 'next'

import { urlDelSitio } from '@/compartido/infraestructura/url-del-sitio-configurada'

import { reglasDeRobots } from './mapa-y-robots'

// /robots.txt. No usa la base de datos: se genera al compilar con NEXT_PUBLIC_SITE_URL.
export default function robots(): MetadataRoute.Robots {
  return reglasDeRobots(urlDelSitio())
}
