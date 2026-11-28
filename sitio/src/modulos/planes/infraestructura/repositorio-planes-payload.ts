import { etiquetaDeColeccion } from '@/compartido/dominio/etiquetas-de-cache'
import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import { leerEnCache } from '@/compartido/infraestructura/lectura-en-cache'

import type { RepositorioPlanes } from '../aplicacion/obtener-matriz-de-planes'

// Límites holgados: 4 planes × 22 características en la v4.
const MAXIMO_DE_PLANES = 12
const MAXIMO_DE_CARACTERISTICAS = 100

// Lecturas públicas, sin poblar relaciones: bastan los ids.
const LECTURA_PUBLICA = { depth: 0, pagination: false, overrideAccess: false } as const

const idDe = (valor: number | { id: number }): number =>
  typeof valor === 'number' ? valor : valor.id

export const repositorioPlanesPayload: RepositorioPlanes = {
  // La clave cambió al agregar `visible`: una entrada guardada antes no lo trae y ocultaría
  // todos los planes si se leyera con la regla nueva.
  listarPlanes: leerEnCache(
    'planes.listarConVisibilidad',
    [etiquetaDeColeccion('planes')],
    async () => {
      const payload = await obtenerPayload()
      const { docs } = await payload.find({
        collection: 'planes',
        sort: 'orden',
        limit: MAXIMO_DE_PLANES,
        ...LECTURA_PUBLICA,
      })
      // `activo` vacío solo existiría en una fila anterior a la migración que lo agregó con valor
      // `true`; se trata igual que la base: visible.
      return docs.map(({ id, nombre, mensajeDeConsulta, activo }) => ({
        id,
        nombre,
        mensajeDeConsulta: mensajeDeConsulta || null,
        visible: activo !== false,
      }))
    },
  ),
  listarCaracteristicas: leerEnCache(
    'caracteristicas-de-plan.listar',
    [etiquetaDeColeccion('caracteristicas-de-plan')],
    async () => {
      const payload = await obtenerPayload()
      const { docs } = await payload.find({
        collection: 'caracteristicas-de-plan',
        sort: 'orden',
        limit: MAXIMO_DE_CARACTERISTICAS,
        ...LECTURA_PUBLICA,
      })
      return docs.map(({ id, nombre }) => ({ id, nombre }))
    },
  ),
  listarInclusiones: leerEnCache(
    'inclusiones-de-plan.listar',
    [etiquetaDeColeccion('inclusiones-de-plan')],
    async () => {
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
  ),
}
