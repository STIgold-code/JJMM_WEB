import type { Payload, TypedUser } from 'payload'

import type { ResultadoDelRepositorio } from '../aplicacion/gestionar-mensajes'
import type {
  RepositorioDeEscrituraDePlanes,
  ResultadoDeEscritura,
} from '../aplicacion/gestionar-planes'
import { cambiosDeInclusiones } from '../dominio/inclusiones-a-guardar'
import type { PosicionGuardada } from '../dominio/orden-de-planes'
import type { InclusionDelPanel } from '../dominio/planes'
import type { PlanValidado } from '../dominio/validacion-de-plan'
import { traducirErrorDePayload } from './errores-de-payload'
import type { SesionDelPanel } from './sesion-del-panel'
import { enTransaccion, type PeticionDeTransaccion } from './transaccion-payload'

interface Contexto {
  payload: Payload
  permisos: { overrideAccess: false; user: TypedUser; depth: 0 }
}

async function escribir(
  operacion: () => Promise<{ nombre: string }>,
): Promise<ResultadoDelRepositorio> {
  try {
    const { nombre } = await operacion()
    return { estado: 'hecho', nombre }
  } catch (error) {
    return traducirErrorDePayload(error)
  }
}

async function reordenar(
  { payload, permisos }: Contexto,
  cambios: readonly PosicionGuardada[],
): Promise<ResultadoDeEscritura> {
  try {
    await enTransaccion(payload, async (req) => {
      for (const { id, orden } of cambios)
        await payload.update({ collection: 'planes', id, data: { orden }, ...permisos, req })
    })
    return { estado: 'hecho' }
  } catch (error) {
    return traducirErrorDePayload(error)
  }
}

const idDe = (valor: number | { id: number }): number =>
  typeof valor === 'number' ? valor : valor.id

async function celdasGuardadas(
  { payload, permisos }: Contexto,
  plan: number,
  req: PeticionDeTransaccion,
): Promise<InclusionDelPanel[]> {
  const { docs } = await payload.find({
    collection: 'inclusiones-de-plan',
    where: { plan: { equals: plan } },
    pagination: false,
    ...permisos,
    req,
  })
  return docs.map((doc) => ({
    id: doc.id,
    plan,
    caracteristica: idDe(doc.caracteristica),
    tipo: doc.tipo,
    texto: doc.texto ?? null,
  }))
}

// Escribe solo las celdas que cambiaron. `alEscribir` recibe la celda en curso, para nombrarla
// si la colección la rechaza.
async function escribirCeldas(
  contexto: Contexto,
  plan: number,
  datos: PlanValidado,
  req: PeticionDeTransaccion,
  alEscribir: (paso: string) => void,
): Promise<void> {
  const { payload, permisos } = contexto
  const guardadas = await celdasGuardadas(contexto, plan, req)
  const { actualizar, crear } = cambiosDeInclusiones(guardadas, datos.celdas)
  for (const { id, caracteristica, tipo, texto } of actualizar) {
    alEscribir(`inclusiones.${caracteristica}`)
    const data = { tipo, texto }
    await payload.update({ collection: 'inclusiones-de-plan', id, data, ...permisos, req })
  }
  for (const { caracteristica, tipo, texto } of crear) {
    alEscribir(`inclusiones.${caracteristica}`)
    const data = { plan, caracteristica, tipo, texto }
    await payload.create({ collection: 'inclusiones-de-plan', data, ...permisos, req })
  }
}

// El plan y sus celdas en una transacción: todo o nada. Si la colección rechaza una celda, su
// campo vuelve como `inclusiones.<característica>.<campo>`.
async function guardar(
  contexto: Contexto,
  id: number,
  datos: PlanValidado,
): Promise<ResultadoDeEscritura> {
  const { payload, permisos } = contexto
  let paso: string | null = null
  try {
    await enTransaccion(payload, async (req) => {
      const data = {
        nombre: datos.nombre,
        mensajeDeConsulta: datos.mensajeDeConsulta,
        activo: datos.visible,
      }
      await payload.update({ collection: 'planes', id, data, ...permisos, req })
      await escribirCeldas(contexto, id, datos, req, (actual) => (paso = actual))
    })
    return { estado: 'hecho' }
  } catch (error) {
    const rechazo = traducirErrorDePayload(error)
    if (rechazo.estado !== 'invalido' || paso === null) return rechazo
    const campos = rechazo.campos.length > 0 ? rechazo.campos : ['']
    return { estado: 'invalido', campos: campos.map((campo) => `${paso}.${campo}`) }
  }
}

// Adaptador de Payload de las escrituras de planes. Toda escritura usa la Local API con
// `overrideAccess: false` y el usuario de la sesión, y pasa por los hooks de la colección: la
// caché del sitio público se invalida sola (el borrado de un plan borra antes sus celdas).
export function crearEscrituraDePlanes(sesion: SesionDelPanel): RepositorioDeEscrituraDePlanes {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario, depth: 0 } as const
  const contexto: Contexto = { payload, permisos }
  const leer = { ...permisos, pagination: false } as const
  return {
    listarPosiciones: async () => {
      const { docs } = await payload.find({ collection: 'planes', sort: 'orden', ...leer })
      return docs.map(({ id, orden }) => ({ id, orden }))
    },
    listarIdsDeCaracteristicas: async () => {
      const { docs } = await payload.find({ collection: 'caracteristicas-de-plan', ...leer })
      return docs.map(({ id }) => id)
    },
    cambiarVisibilidad: (id, visible) =>
      escribir(() =>
        payload.update({ collection: 'planes', id, data: { activo: visible }, ...permisos }),
      ),
    reordenar: (cambios) => reordenar(contexto, cambios),
    crear: async (nombre, orden) => {
      try {
        const data = { nombre, orden, activo: false }
        const { id } = await payload.create({ collection: 'planes', data, ...permisos })
        return { estado: 'hecho', id }
      } catch (error) {
        return traducirErrorDePayload(error)
      }
    },
    guardar: (id, datos) => guardar(contexto, id, datos),
    eliminar: (id) => escribir(() => payload.delete({ collection: 'planes', id, ...permisos })),
  }
}
