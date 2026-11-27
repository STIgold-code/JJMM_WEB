import type { Payload } from 'payload'

import type { RepositorioDelInicio } from '../aplicacion/obtener-inicio'
import type { ConteosDelSitio } from '../dominio/cifras'
import { type AvanceDelSitio, digitosConFecha } from '../dominio/faltantes'
import type { BorradorPendiente, MensajePendiente } from '../dominio/pendientes'
import { crearConsultas } from './consultas-del-panel'
import type { SesionDelPanel } from './sesion-del-panel'

const ACTIVOS = { activo: { equals: true } }
const NUEVOS = { estado: { equals: 'nuevo' } }
const BORRADORES = { _status: { equals: 'draft' } }
const PUBLICADAS = { _status: { equals: 'published' } }
// Más sedes que esto no tiene el estudio; el límite evita traer una lista sin tope.
const LIMITE_DE_SEDES = 50

type Contexto = ReturnType<typeof crearConsultas> & { payload: Payload }

async function listarMensajesNuevos(
  c: Contexto,
  limite: number,
): Promise<MensajePendiente[] | null> {
  if (!c.puedeLeer('mensajes-de-contacto')) return null
  const { docs } = await c.payload.find({
    collection: 'mensajes-de-contacto',
    where: NUEVOS,
    sort: '-createdAt',
    limit: limite,
    ...c.lectura,
  })
  return docs.map(({ id, nombre, servicioDeInteres, createdAt }) => ({
    id,
    nombre,
    servicio: servicioDeInteres ?? null,
    recibido: createdAt,
  }))
}

async function listarBorradores(c: Contexto, limite: number): Promise<BorradorPendiente[] | null> {
  if (!c.puedeLeer('publicaciones')) return null
  const { docs } = await c.payload.find({
    collection: 'publicaciones',
    where: BORRADORES,
    sort: '-updatedAt',
    limit: limite,
    ...c.lectura,
  })
  return docs.map(({ id, titulo, updatedAt }) => ({ id, titulo, actualizado: updatedAt }))
}

async function contarContenido(c: Contexto): Promise<ConteosDelSitio> {
  const [planes, areas, sedesActivas, clientesActivos, avisosActivos, vencimientos] =
    await Promise.all([
      c.contar('planes'),
      c.contar('areas-de-servicio'),
      c.contar('sedes', ACTIVOS),
      c.contar('clientes', ACTIVOS),
      c.contar('avisos-para-clientes', ACTIVOS),
      c.contar('vencimientos'),
    ])
  return { planes, areas, sedesActivas, clientesActivos, avisosActivos, vencimientos }
}

// El cronograma más reciente (año y mes) es el que muestra la Guía de clientes.
async function digitosDelCronograma(c: Contexto): Promise<number | null> {
  if (!c.puedeLeer('cronogramas-sunat')) return null
  const { docs } = await c.payload.find({
    collection: 'cronogramas-sunat',
    sort: ['-anio', '-mes'],
    limit: 1,
    ...c.lectura,
  })
  return digitosConFecha(docs[0]?.fechasPorDigito)
}

async function sedesConCelular(c: Contexto): Promise<AvanceDelSitio['sedes']> {
  if (!c.puedeLeer('sedes')) return null
  const { docs } = await c.payload.find({
    collection: 'sedes',
    where: ACTIVOS,
    limit: LIMITE_DE_SEDES,
    ...c.lectura,
  })
  const conCelular = docs.filter((sede) => (sede.celulares?.length ?? 0) > 0).length
  return { activas: docs.length, conCelular }
}

async function leerAvance(c: Contexto): Promise<AvanceDelSitio> {
  const [digitos, sedes, publicadas] = await Promise.all([
    digitosDelCronograma(c),
    sedesConCelular(c),
    c.contar('publicaciones', PUBLICADAS),
  ])
  return { digitosDelCronograma: digitos, sedes, publicadas }
}

// Adaptador de Payload del inicio del panel. Cada lectura usa los permisos de la sesión.
export function crearRepositorioDelInicio(sesion: SesionDelPanel): RepositorioDelInicio {
  const c: Contexto = { ...crearConsultas(sesion), payload: sesion.payload }
  return {
    contarMensajesNuevos: () => c.contar('mensajes-de-contacto', NUEVOS),
    contarBorradores: () => c.contar('publicaciones', BORRADORES),
    listarMensajesNuevos: (limite) => listarMensajesNuevos(c, limite),
    listarBorradores: (limite) => listarBorradores(c, limite),
    contarContenido: () => contarContenido(c),
    leerAvance: () => leerAvance(c),
  }
}
