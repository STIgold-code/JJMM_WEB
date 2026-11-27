import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'

import type { RepositorioPlanes } from '../aplicacion/obtener-matriz-de-planes'

// Límites holgados: 4 planes × 22 características en la v4.
const MAXIMO_DE_PLANES = 12
const MAXIMO_DE_CARACTERISTICAS = 100

// Lecturas públicas, sin poblar relaciones: bastan los ids.
const LECTURA_PUBLICA = { depth: 0, pagination: false, overrideAccess: false } as const

const idDe = (valor: number | { id: number }): number =>
  typeof valor === 'number' ? valor : valor.id

export const repositorioPlanesPayload: RepositorioPlanes = {
  async listarPlanes() {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'planes',
      sort: 'orden',
      limit: MAXIMO_DE_PLANES,
      ...LECTURA_PUBLICA,
    })
    return docs.map(({ id, nombre, mensajeDeConsulta }) => ({
      id,
      nombre,
      mensajeDeConsulta: mensajeDeConsulta || null,
    }))
  },
  async listarCaracteristicas() {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'caracteristicas-de-plan',
      sort: 'orden',
      limit: MAXIMO_DE_CARACTERISTICAS,
      ...LECTURA_PUBLICA,
    })
    return docs.map(({ id, nombre }) => ({ id, nombre }))
  },
  async listarInclusiones() {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'inclusiones-de-plan',
      limit: MAXIMO_DE_PLANES * MAXIMO_DE_CARACTERISTICAS,
      ...LECTURA_PUBLICA,
    })
    return docs.map((inclusion) => ({
      plan: idDe(inclusion.plan),
      caracteristica: idDe(inclusion.caracteristica),
      tipo: inclusion.tipo,
      texto: inclusion.texto ?? null,
    }))
  },
}
