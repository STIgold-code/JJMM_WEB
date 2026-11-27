import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { getPayload } from 'payload'

import config from '../payload.config'
import { crearPuertoPayload } from './adaptador-payload'
import { leerAdministrador } from './carga/cargar-administrador'
import { cargarSemilla } from './cargar'
import { SEMILLA } from './datos'

// Punto de entrada de `pnpm semilla` (`payload run`, que carga el .env y ejecuta TypeScript).
// Las rutas de las imágenes son relativas a la raíz del proyecto (`sitio/`).
const RAIZ_DEL_PROYECTO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')

const payload = await getPayload({ config })

try {
  const { administradorCreado } = await cargarSemilla(crearPuertoPayload(payload), SEMILLA, {
    resolverRuta: (archivo) => path.join(RAIZ_DEL_PROYECTO, archivo),
    administrador: leerAdministrador(process.env),
  })
  payload.logger.info(
    administradorCreado
      ? 'Carga inicial terminada. Se creó la cuenta de administrador.'
      : 'Carga inicial terminada.',
  )
  process.exit(0)
} catch (error) {
  payload.logger.error({ err: error, msg: 'La carga inicial falló.' })
  process.exit(1)
}
