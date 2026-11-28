import type { Payload, TypedUser } from 'payload'

import type { RepositorioDeEscrituraDeFilas } from '../aplicacion/gestionar-filas'
import type { CambiosDeFilas } from '../dominio/cambios-de-filas'
import { traducirErrorDePayload } from './errores-de-payload'
import type { SesionDelPanel } from './sesion-del-panel'
import { enTransaccion, type PeticionDeTransaccion } from './transaccion-payload'

const COLECCION = 'caracteristicas-de-plan'

interface Contexto {
  payload: Payload
  permisos: { overrideAccess: false; user: TypedUser; depth: 0 }
}

// Primero se borran las filas que se quitaron (así su nombre queda libre); las que toman el nombre
// actual de otra pasan por un nombre temporal (el nombre es único); después se actualizan y al
// final se crean. Cada borrado pasa `req`: el hook `beforeDelete` de la colección borra las
// celdas de esa fila dentro de la misma transacción. `alEscribir` recibe la posición de la fila en
// curso, para nombrarla si la colección la rechaza.
async function escribir(
  { payload, permisos }: Contexto,
  cambios: CambiosDeFilas,
  req: PeticionDeTransaccion,
  alEscribir: (posicion: number | null) => void,
): Promise<void> {
  for (const id of cambios.eliminar) {
    alEscribir(null)
    await payload.delete({ collection: COLECCION, id, ...permisos, req })
  }
  for (const { id, posicion, nombre } of cambios.temporales) {
    alEscribir(posicion)
    await payload.update({ collection: COLECCION, id, data: { nombre }, ...permisos, req })
  }
  for (const { id, posicion, datos } of cambios.actualizar) {
    alEscribir(posicion)
    await payload.update({ collection: COLECCION, id, data: datos, ...permisos, req })
  }
  for (const { posicion, datos } of cambios.crear) {
    alEscribir(posicion)
    await payload.create({ collection: COLECCION, data: datos, ...permisos, req })
  }
}

async function aplicar(contexto: Contexto, cambios: CambiosDeFilas) {
  let posicion: number | null = null
  try {
    await enTransaccion(contexto.payload, (req) =>
      escribir(contexto, cambios, req, (actual) => (posicion = actual)),
    )
    return { estado: 'hecho' as const }
  } catch (error) {
    const rechazo = traducirErrorDePayload(error)
    if (rechazo.estado !== 'invalido' || posicion === null) return rechazo
    const campos = rechazo.campos.length > 0 ? rechazo.campos : ['nombre']
    return { estado: 'invalido' as const, campos: campos.map((c) => `filas.${posicion}.${c}`) }
  }
}

// Adaptador de Payload de las escrituras de las filas de la tabla. Toda escritura usa la Local API
// con `overrideAccess: false` y el usuario de la sesión, en una sola transacción, y pasa por los
// hooks de la colección (validación de montos, caché del sitio, borrado de celdas). Solo escribe
// `nombre` y `orden`; nunca crea celdas: una fila nueva es «No incluido» en todos los planes.
export function crearEscrituraDeFilas(sesion: SesionDelPanel): RepositorioDeEscrituraDeFilas {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  return {
    listarFilas: async () => {
      const { docs } = await payload.find({
        collection: COLECCION,
        sort: 'orden',
        pagination: false,
        ...permisos,
      })
      return docs.map(({ id, nombre, orden }) => ({ id, nombre, orden }))
    },
    aplicar: (cambios) => aplicar({ payload, permisos }, cambios),
  }
}
