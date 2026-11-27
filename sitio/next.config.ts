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

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        // Archivos de la colección `medios` (en disco o en Wasabi, siempre por esta ruta).
        pathname: '/api/medios/file/**',
      },
    ],
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
