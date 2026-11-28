import type { Payload, TypedUser } from 'payload'

import type { ResultadoDeEscritura } from '../aplicacion/resultados-de-escritura'
import type { PosicionGuardada } from '../dominio/orden'
import { traducirErrorDePayload } from './errores-de-payload'
import { enTransaccion } from './transaccion-payload'

// Colecciones del panel con el campo numérico `orden`.
export type ColeccionOrdenable = 'planes' | 'sedes' | 'avisos-para-clientes'

interface Permisos {
  overrideAccess: false
  user: TypedUser
  depth: 0
}

// Escribe el `orden` nuevo de cada documento en una sola transacción: todos o ninguno. Solo toca
// el campo `orden`, con los permisos de la sesión.
export async function reordenarEnTransaccion(
  payload: Payload,
  permisos: Permisos,
  coleccion: ColeccionOrdenable,
  cambios: readonly PosicionGuardada[],
): Promise<ResultadoDeEscritura> {
  try {
    await enTransaccion(payload, async (req) => {
      for (const { id, orden } of cambios)
        await payload.update({ collection: coleccion, id, data: { orden }, ...permisos, req })
    })
    return { estado: 'hecho' }
  } catch (error) {
    return traducirErrorDePayload(error)
  }
}
