import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/constants'
import path from 'path'
import { fileURLToPath } from 'url'

// Rutas relativas sin alias: este archivo se carga antes de que existan los alias de tsconfig.
import { REDIRECCIONES_HEREDADAS } from './src/app/redirecciones-heredadas'
import { leerUrlDelSitio } from './src/compartido/dominio/url-del-sitio'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

// Next carga el .env antes de este archivo. En producción, sin una URL pública válida la
// compilación y el arranque fallan aquí con un mensaje claro, no con enlaces rotos después.
const FASES_DE_PRODUCCION = new Set([PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER])

// Archivos de `medios` servidos por Payload. Sus nombres no llevan hash (reemplazar el archivo
// puede conservar el nombre), así que no son `immutable`: una hora fresca y un día más
// sirviendo la copia mientras se renueva. Los lee cualquiera, por eso `public`. Las fuentes y
// el JavaScript van en `/_next/static` con hash y Next ya los sirve `immutable` por un año.
const CACHE_DE_MEDIOS = 'public, max-age=3600, stale-while-revalidate=86400'

const nextConfig: NextConfig = {
  images: {
    // AVIF primero (más liviano); WebP para los navegadores sin AVIF.
    formats: ['image/avif', 'image/webp'],
    // Anchos de pantalla × densidad para imágenes a todo el ancho (la portada): de un celular
    // (412 px × 1,75 en Lighthouse móvil ≈ 721 → 750) al escritorio de la v4 (contenido de
    // 73rem ≈ 1168 px; cortes en 46rem y 70rem). Sin 2048 ni 3840: en pantallas 2K o 4K una
    // portada de 1920 px se ve bien y pesa varias veces menos.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    localPatterns: [
      {
        // Archivos de la colección `medios` (en disco o en Wasabi, siempre por esta ruta).
        pathname: '/api/medios/file/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/medios/file/:archivo*',
        headers: [{ key: 'Cache-Control', value: CACHE_DE_MEDIOS }],
      },
    ]
  },
  // URL del sitio anterior que se conservan con 301 (S1).
  async redirects() {
    return [...REDIRECCIONES_HEREDADAS]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default function configuracion(fase: string): NextConfig {
  if (FASES_DE_PRODUCCION.has(fase)) leerUrlDelSitio(process.env.NEXT_PUBLIC_SITE_URL)
  return withPayload(nextConfig, { devBundleServerPackages: false })
}
