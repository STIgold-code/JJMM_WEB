import type { Rol } from '@/compartido/dominio/roles'

import { leerId } from '../dominio/identificadores'
import { ordenesAActualizar, type PosicionGuardada } from '../dominio/orden'
import type { Aviso } from '../dominio/respuesta-al-mensaje'
import {
  avisoDeSedeEliminada,
  avisoDeVisibilidadDeSede,
  puedeEliminarSedes,
} from '../dominio/sedes'
import type { SedeValidada } from '../dominio/validacion-de-sede'
import { ERROR_SIN_PERMISO, type ResultadoDelRepositorio } from './gestionar-mensajes'
import {
  ERROR_DE_VALOR,
  type RechazoDelRepositorio,
  type ResultadoDeAccionRapida,
  type ResultadoDeCreacion,
  type ResultadoDeEscritura,
} from './resultados-de-escritura'

// Escrituras sobre las sedes. Todo lo que llega del navegador es `unknown` y se valida aquí; el
// repositorio escribe con los permisos de la sesión, así la colección tiene la última palabra.
export interface RepositorioDeEscrituraDeSedes {
  listarPosiciones(): Promise<PosicionGuardada[]>
  cambiarVisibilidad(id: number, visible: boolean): Promise<ResultadoDelRepositorio>
  // Todos los cambios o ninguno (una transacción).
  reordenar(cambios: readonly PosicionGuardada[]): Promise<ResultadoDeEscritura>
  crear(datos: SedeValidada, orden: number): Promise<ResultadoDeCreacion>
  guardar(id: number, datos: SedeValidada): Promise<ResultadoDeEscritura>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export const ERROR_DE_SEDE_INEXISTENTE =
  'No encontramos esa sede. Puede que alguien la haya eliminado; recarga la página.'
export const ERROR_DE_ORDEN_DE_SEDES =
  'La lista de sedes cambió mientras ordenabas. Recarga la página e inténtalo de nuevo.'
// Por ejemplo, una sede antigua con un teléfono fijo que hoy no pasa la validación.
export const ERROR_DE_DATOS_DE_LA_SEDE =
  'No se pudo guardar: la sede tiene datos que no son válidos. Ábrela, corrígelos y vuelve a intentarlo.'

const fallo = (error: string): ResultadoDeAccionRapida => ({ ok: false, error })

export function rechazoDeSedeComoError(rechazo: RechazoDelRepositorio): string {
  if (rechazo.estado === 'no-encontrado') return ERROR_DE_SEDE_INEXISTENTE
  if (rechazo.estado === 'prohibido') return ERROR_SIN_PERMISO
  return ERROR_DE_DATOS_DE_LA_SEDE
}

function resultado(
  escritura: ResultadoDelRepositorio,
  aviso: (nombre: string) => Aviso,
): ResultadoDeAccionRapida {
  if (escritura.estado !== 'hecho') return fallo(rechazoDeSedeComoError(escritura))
  return { ok: true, aviso: aviso(escritura.nombre) }
}

export async function cambiarVisibilidadDeSede(
  repositorio: RepositorioDeEscrituraDeSedes,
  entrada: { id: unknown; visible: unknown },
): Promise<ResultadoDeAccionRapida> {
  const id = leerId(entrada.id)
  if (id === null) return fallo(ERROR_DE_SEDE_INEXISTENTE)
  const { visible } = entrada
  if (typeof visible !== 'boolean') return fallo(ERROR_DE_VALOR)
  const escritura = await repositorio.cambiarVisibilidad(id, visible)
  return resultado(escritura, (nombre) => avisoDeVisibilidadDeSede(nombre, visible))
}

// Recibe la lista completa de ids en el orden nuevo. Sin cambios no escribe nada.
export async function ordenarSedes(
  repositorio: RepositorioDeEscrituraDeSedes,
  idsEnOrden: unknown,
): Promise<ResultadoDeAccionRapida> {
  const cambios = ordenesAActualizar(await repositorio.listarPosiciones(), idsEnOrden)
  if (cambios === null) return fallo(ERROR_DE_ORDEN_DE_SEDES)
  if (cambios.length === 0) return { ok: true }
  const escritura = await repositorio.reordenar(cambios)
  return escritura.estado === 'hecho' ? { ok: true } : fallo(rechazoDeSedeComoError(escritura))
}

// El rol sale de la sesión del servidor, nunca del navegador.
export async function eliminarSede(
  repositorio: RepositorioDeEscrituraDeSedes,
  entrada: { id: unknown; rol: Rol },
): Promise<ResultadoDeAccionRapida> {
  if (!puedeEliminarSedes(entrada.rol)) return fallo(ERROR_SIN_PERMISO)
  const id = leerId(entrada.id)
  if (id === null) return fallo(ERROR_DE_SEDE_INEXISTENTE)
  return resultado(await repositorio.eliminar(id), avisoDeSedeEliminada)
}
