import type { Payload, TypedUser } from 'payload'

import type { RepositorioDeEscrituraDeVencimientos } from '../aplicacion/gestionar-vencimientos'
import type { VencimientoValidado } from '../dominio/validacion-de-vencimiento'
import { escribirConPayload, escribirDocumento } from './errores-de-payload'
import type { SesionDelPanel } from './sesion-del-panel'

const COLECCION = 'vencimientos'

interface Contexto {
  payload: Payload
  permisos: { overrideAccess: false; user: TypedUser; depth: 0 }
}

// Solo los campos que edita el panel, con los nombres de la colección.
const datosDelVencimiento = (datos: VencimientoValidado) => ({
  obligacion: datos.obligacion,
  periodicidad: datos.periodicidad,
  cuandoVence: datos.cuandoVence,
  nota: datos.nota,
})

async function listarPosiciones({ payload, permisos }: Contexto) {
  const { docs } = await payload.find({
    collection: COLECCION,
    sort: 'orden',
    pagination: false,
    ...permisos,
  })
  return docs.map(({ id, orden }) => ({ id, orden }))
}

async function crear({ payload, permisos }: Contexto, datos: VencimientoValidado, orden: number) {
  const data = { ...datosDelVencimiento(datos), orden }
  const escritura = await escribirDocumento(() =>
    payload.create({ collection: COLECCION, data, ...permisos }),
  )
  if (escritura.estado !== 'hecho') return escritura
  return { estado: 'hecho' as const, id: escritura.documento.id }
}

async function eliminar({ payload, permisos }: Contexto, id: number) {
  const escritura = await escribirDocumento(() =>
    payload.delete({ collection: COLECCION, id, ...permisos }),
  )
  if (escritura.estado !== 'hecho') return escritura
  return { estado: 'hecho' as const, nombre: escritura.documento.obligacion }
}

// Adaptador de Payload de las escrituras de vencimientos: Local API con `overrideAccess: false` y
// el usuario de la sesión. Los hooks de la colección invalidan la caché del sitio público.
export function crearEscrituraDeVencimientos(
  sesion: SesionDelPanel,
): RepositorioDeEscrituraDeVencimientos {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  const contexto: Contexto = { payload, permisos }
  return {
    listarPosiciones: () => listarPosiciones(contexto),
    crear: (datos, orden) => crear(contexto, datos, orden),
    guardar: (id, datos) =>
      escribirConPayload(() =>
        payload.update({
          collection: COLECCION,
          id,
          data: datosDelVencimiento(datos),
          ...permisos,
        }),
      ),
    eliminar: (id) => eliminar(contexto, id),
  }
}
