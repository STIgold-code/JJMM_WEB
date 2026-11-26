import { s3Storage } from '@payloadcms/storage-s3'
import type { Plugin } from 'payload'

export interface ConfiguracionWasabi {
  bucket: string
  region: string
  endpoint: string
  accessKeyId: string
  secretAccessKey: string
}

type Entorno = Readonly<Record<string, string | undefined>>

function leerVariable(entorno: Entorno, nombre: string): string | undefined {
  return entorno[nombre]?.trim()
}

// Devuelve la configuración solo si todas las variables existen; si falta alguna, null.
export function leerConfiguracionWasabi(entorno: Entorno): ConfiguracionWasabi | null {
  const bucket = leerVariable(entorno, 'WASABI_BUCKET')
  const region = leerVariable(entorno, 'WASABI_REGION')
  const endpoint = leerVariable(entorno, 'WASABI_ENDPOINT')
  const accessKeyId = leerVariable(entorno, 'WASABI_ACCESS_KEY_ID')
  const secretAccessKey = leerVariable(entorno, 'WASABI_SECRET_ACCESS_KEY')

  if (!bucket || !region || !endpoint || !accessKeyId || !secretAccessKey) return null
  return { bucket, region, endpoint, accessKeyId, secretAccessKey }
}

// Sin configuración de Wasabi no se registra el adaptador y Payload guarda en disco local.
export function crearAlmacenamientoWasabi(
  entorno: Entorno,
  colecciones: readonly string[],
): Plugin[] {
  const configuracion = leerConfiguracionWasabi(entorno)
  if (!configuracion) return []

  return [
    s3Storage({
      collections: Object.fromEntries(colecciones.map((slug) => [slug, true])),
      bucket: configuracion.bucket,
      config: {
        credentials: {
          accessKeyId: configuracion.accessKeyId,
          secretAccessKey: configuracion.secretAccessKey,
        },
        region: configuracion.region,
        endpoint: configuracion.endpoint,
        // Wasabi recomienda direccionamiento por ruta cuando se usa un endpoint propio.
        forcePathStyle: true,
      },
    }),
  ]
}
