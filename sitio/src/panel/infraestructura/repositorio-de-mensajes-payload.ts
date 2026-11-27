import type { Where } from 'payload'

import type { MensajesDeContacto } from '@/payload-types'

import type {
  FiltroDeLectura,
  MensajeDeContacto,
  RepositorioDeLecturaDeMensajes,
} from '../aplicacion/consultar-mensajes'
import type {
  RepositorioDeEscrituraDeMensajes,
  ResultadoDelRepositorio,
} from '../aplicacion/gestionar-mensajes'
import { traducirErrorDePayload } from './errores-de-payload'
import type { SesionDelPanel } from './sesion-del-panel'

const COLECCION = 'mensajes-de-contacto'
// Campos donde busca el buscador del listado (los mismos que `listSearchableFields`).
const CAMPOS_DE_BUSQUEDA = ['nombre', 'mensaje', 'servicioDeInteres', 'celular', 'correo'] as const

function condicion({ estado, busqueda }: FiltroDeLectura): Where | undefined {
  const partes: Where[] = []
  if (estado) partes.push({ estado: { equals: estado } })
  if (busqueda)
    partes.push({ or: CAMPOS_DE_BUSQUEDA.map((campo) => ({ [campo]: { like: busqueda } })) })
  return partes.length > 0 ? { and: partes } : undefined
}

const aMensaje = (doc: MensajesDeContacto): MensajeDeContacto => ({
  id: doc.id,
  nombre: doc.nombre,
  servicio: doc.servicioDeInteres?.trim() || null,
  mensaje: doc.mensaje,
  estado: doc.estado,
  celular: doc.celular?.trim() || null,
  correo: doc.correo?.trim() || null,
  recibido: doc.createdAt,
})

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

// Adaptador de Payload de los mensajes. Toda lectura y escritura usa la Local API con
// `overrideAccess: false` y el usuario de la sesión: las reglas de acceso de la colección deciden
// (el equipo lee y actualiza; solo el administrador elimina).
export function crearRepositorioDeMensajes(
  sesion: SesionDelPanel,
): RepositorioDeLecturaDeMensajes & RepositorioDeEscrituraDeMensajes {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario } as const
  return {
    contar: async (filtro) =>
      (await payload.count({ collection: COLECCION, where: condicion(filtro), ...permisos }))
        .totalDocs,
    listar: async (filtro, pagina, limite) => {
      const { docs } = await payload.find({
        collection: COLECCION,
        where: condicion(filtro),
        sort: '-createdAt',
        page: pagina,
        limit: limite,
        depth: 0,
        ...permisos,
      })
      return docs.map(aMensaje)
    },
    buscar: async (id) => {
      const doc = await payload.findByID({
        collection: COLECCION,
        id,
        depth: 0,
        disableErrors: true,
        ...permisos,
      })
      return doc ? aMensaje(doc) : null
    },
    actualizar: (id, cambios) =>
      escribir(() =>
        payload.update({ collection: COLECCION, id, data: cambios, depth: 0, ...permisos }),
      ),
    eliminar: (id) =>
      escribir(() => payload.delete({ collection: COLECCION, id, depth: 0, ...permisos })),
  }
}
