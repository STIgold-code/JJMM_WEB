import type { Rol } from '@/compartido/dominio/roles'

import { avisoDePlanEliminado, avisoDeVisibilidad } from '../dominio/avisos-de-planes'
import { leerId } from '../dominio/identificadores'
import { ordenesAActualizar, type PosicionGuardada } from '../dominio/orden'
import { puedeEliminarPlanes } from '../dominio/planes'
import type { Aviso } from '../dominio/respuesta-al-mensaje'
import type { PlanValidado } from '../dominio/validacion-de-plan'
import { ERROR_SIN_PERMISO, type ResultadoDelRepositorio } from './gestionar-mensajes'
import {
  ERROR_DE_VALOR,
  type RechazoDelRepositorio,
  type ResultadoDeAccionRapida,
  type ResultadoDeCreacion,
  type ResultadoDeEscritura,
} from './resultados-de-escritura'

// Escrituras sobre los planes. Todo lo que llega del navegador es `unknown` y se valida aquí; el
// repositorio escribe con los permisos de la sesión, así la colección tiene la última palabra.
export type { RechazoDelRepositorio, ResultadoDeCreacion, ResultadoDeEscritura }
export { ERROR_DE_VALOR }

export interface RepositorioDeEscrituraDePlanes {
  listarPosiciones(): Promise<PosicionGuardada[]>
  listarIdsDeCaracteristicas(): Promise<number[]>
  cambiarVisibilidad(id: number, visible: boolean): Promise<ResultadoDelRepositorio>
  // Todos los cambios o ninguno (una transacción).
  reordenar(cambios: readonly PosicionGuardada[]): Promise<ResultadoDeEscritura>
  crear(nombre: string, orden: number): Promise<ResultadoDeCreacion>
  // El plan y sus celdas de «Qué incluye», todo o nada (una transacción).
  guardar(id: number, datos: PlanValidado): Promise<ResultadoDeEscritura>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export type ResultadoDeAccionDePlan = ResultadoDeAccionRapida

export const ERROR_DE_PLAN_INEXISTENTE =
  'No encontramos ese plan. Puede que alguien lo haya eliminado; recarga la página.'
export const ERROR_DE_ORDEN =
  'La lista de planes cambió mientras ordenabas. Recarga la página e inténtalo de nuevo.'
// Por ejemplo, un plan antiguo con un nombre que hoy no pasa la validación de la colección.
export const ERROR_DE_DATOS_DEL_PLAN =
  'No se pudo guardar: el plan tiene datos que no son válidos. Ábrelo, corrígelos y vuelve a intentarlo.'

const fallo = (error: string): ResultadoDeAccionDePlan => ({ ok: false, error })

export function rechazoComoError(rechazo: RechazoDelRepositorio): string {
  if (rechazo.estado === 'no-encontrado') return ERROR_DE_PLAN_INEXISTENTE
  if (rechazo.estado === 'prohibido') return ERROR_SIN_PERMISO
  return ERROR_DE_DATOS_DEL_PLAN
}

function resultado(
  escritura: ResultadoDelRepositorio,
  aviso: (nombre: string) => Aviso,
): ResultadoDeAccionDePlan {
  if (escritura.estado !== 'hecho') return fallo(rechazoComoError(escritura))
  return { ok: true, aviso: aviso(escritura.nombre) }
}

export async function cambiarVisibilidadDePlan(
  repositorio: RepositorioDeEscrituraDePlanes,
  entrada: { id: unknown; visible: unknown },
): Promise<ResultadoDeAccionDePlan> {
  const id = leerId(entrada.id)
  if (id === null) return fallo(ERROR_DE_PLAN_INEXISTENTE)
  const { visible } = entrada
  if (typeof visible !== 'boolean') return fallo(ERROR_DE_VALOR)
  const escritura = await repositorio.cambiarVisibilidad(id, visible)
  return resultado(escritura, (nombre) => avisoDeVisibilidad(nombre, visible))
}

// Recibe la lista completa de ids en el orden nuevo. Sin cambios no escribe nada.
export async function ordenarPlanes(
  repositorio: RepositorioDeEscrituraDePlanes,
  idsEnOrden: unknown,
): Promise<ResultadoDeAccionDePlan> {
  const cambios = ordenesAActualizar(await repositorio.listarPosiciones(), idsEnOrden)
  if (cambios === null) return fallo(ERROR_DE_ORDEN)
  if (cambios.length === 0) return { ok: true }
  const escritura = await repositorio.reordenar(cambios)
  return escritura.estado === 'hecho' ? { ok: true } : fallo(rechazoComoError(escritura))
}

// El rol sale de la sesión del servidor, nunca del navegador.
export async function eliminarPlan(
  repositorio: RepositorioDeEscrituraDePlanes,
  entrada: { id: unknown; rol: Rol },
): Promise<ResultadoDeAccionDePlan> {
  if (!puedeEliminarPlanes(entrada.rol)) return fallo(ERROR_SIN_PERMISO)
  const id = leerId(entrada.id)
  if (id === null) return fallo(ERROR_DE_PLAN_INEXISTENTE)
  return resultado(await repositorio.eliminar(id), avisoDePlanEliminado)
}
