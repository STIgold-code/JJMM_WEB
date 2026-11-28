import { AVISO_DE_PLAN_GUARDADO, avisoDePlanCreado } from '../dominio/avisos-de-planes'
import { ERROR_NOMBRE_REPETIDO } from '../dominio/formulario-de-plan'
import { leerId } from '../dominio/identificadores'
import { ordenAlFinal } from '../dominio/orden'
import type { Aviso } from '../dominio/respuesta-al-mensaje'
import {
  type ErroresDelPlan,
  validarFormularioDePlan,
  validarNombreDePlan,
} from '../dominio/validacion-de-plan'
import {
  ERROR_DE_PLAN_INEXISTENTE,
  type RechazoDelRepositorio,
  rechazoComoError,
  type RepositorioDeEscrituraDePlanes,
} from './gestionar-planes'

// Guardar la edición de un plan (sus datos y su «Qué incluye») y crear un plan nuevo.
export type EstadoDelGuardado =
  | { estado: 'guardado'; aviso: Aviso }
  | { estado: 'invalido'; errores: ErroresDelPlan }
  | { estado: 'error'; error: string }

export type EstadoDeCreacion =
  | { estado: 'inicial' }
  | { estado: 'creado'; id: number; aviso: Aviso }
  | { estado: 'invalido'; error: string }
  | { estado: 'error'; error: string }

export const ESTADO_INICIAL_DE_CREACION: EstadoDeCreacion = { estado: 'inicial' }

export const ERROR_DE_CELDA = 'No se pudo guardar esta celda. Revisa el texto e inténtalo de nuevo.'

// Celda rechazada por la colección: el repositorio la nombra `inclusiones.<característica>.<campo>`.
const CAMPO_DE_CELDA = /^inclusiones\.(\d+)\./

// Lo que la colección rechazó va junto a su campo. El nombre es único en la colección, y las
// demás reglas ya se validaron antes de escribir: un rechazo del nombre es un nombre repetido.
function erroresDeLaColeccion(campos: readonly string[]): ErroresDelPlan | null {
  const celdas: Record<number, string> = {}
  for (const campo of campos) {
    const caracteristica = CAMPO_DE_CELDA.exec(campo)?.[1]
    if (caracteristica) celdas[Number(caracteristica)] = ERROR_DE_CELDA
  }
  const errores: ErroresDelPlan = {
    ...(campos.includes('nombre') ? { nombre: ERROR_NOMBRE_REPETIDO } : {}),
    ...(Object.keys(celdas).length > 0 ? { celdas } : {}),
  }
  return Object.keys(errores).length > 0 ? errores : null
}

function estadoDelRechazo(rechazo: RechazoDelRepositorio): EstadoDelGuardado {
  const errores = rechazo.estado === 'invalido' ? erroresDeLaColeccion(rechazo.campos) : null
  if (errores) return { estado: 'invalido', errores }
  return { estado: 'error', error: rechazoComoError(rechazo) }
}

export async function guardarPlan(
  repositorio: RepositorioDeEscrituraDePlanes,
  entrada: { id: unknown; formulario: unknown },
): Promise<EstadoDelGuardado> {
  const id = leerId(entrada.id)
  if (id === null) return { estado: 'error', error: ERROR_DE_PLAN_INEXISTENTE }
  const caracteristicas = await repositorio.listarIdsDeCaracteristicas()
  const validacion = validarFormularioDePlan(entrada.formulario, caracteristicas)
  if (!validacion.valido) return { estado: 'invalido', errores: validacion.errores }
  const escritura = await repositorio.guardar(id, validacion.datos)
  if (escritura.estado === 'hecho') return { estado: 'guardado', aviso: AVISO_DE_PLAN_GUARDADO }
  return estadoDelRechazo(escritura)
}

// El plan nuevo va al final de la tabla y oculto, hasta que se elija qué incluye.
export async function crearPlan(
  repositorio: RepositorioDeEscrituraDePlanes,
  entrada: { nombre: unknown },
): Promise<EstadoDeCreacion> {
  const nombre = validarNombreDePlan(entrada.nombre)
  if ('error' in nombre) return { estado: 'invalido', error: nombre.error }
  const orden = ordenAlFinal(await repositorio.listarPosiciones())
  const escritura = await repositorio.crear(nombre.nombre, orden)
  if (escritura.estado === 'hecho')
    return { estado: 'creado', id: escritura.id, aviso: avisoDePlanCreado(nombre.nombre) }
  if (escritura.estado === 'invalido' && escritura.campos.includes('nombre'))
    return { estado: 'invalido', error: ERROR_NOMBRE_REPETIDO }
  return { estado: 'error', error: rechazoComoError(escritura) }
}
