import type { Rol } from '@/compartido/dominio/roles'

import { avisoDeAvisoEliminado, avisoDeVisibilidadDeAviso } from '../dominio/avisos-para-clientes'
import { puedeEliminarEnLaGuia } from '../dominio/guia-de-clientes'
import { leerId } from '../dominio/identificadores'
import { ordenesAActualizar, type PosicionGuardada } from '../dominio/orden'
import type { Aviso } from '../dominio/respuesta-al-mensaje'
import type { AvisoValidado } from '../dominio/validacion-de-aviso'
import { ERROR_SIN_PERMISO, type ResultadoDelRepositorio } from './gestionar-mensajes'
import {
  ERROR_DE_VALOR,
  type RechazoDelRepositorio,
  type ResultadoDeAccionRapida,
  type ResultadoDeCreacion,
  type ResultadoDeEscritura,
  textoDelRechazo,
  type TextosDeRechazo,
} from './resultados-de-escritura'

// Escrituras sobre los avisos de la guía. Todo lo que llega del navegador es `unknown` y se valida
// aquí; el repositorio escribe con los permisos de la sesión, así la colección tiene la última
// palabra.
export interface RepositorioDeEscrituraDeAvisos {
  listarPosiciones(): Promise<PosicionGuardada[]>
  cambiarVisibilidad(id: number, visible: boolean): Promise<ResultadoDelRepositorio>
  // Todos los cambios o ninguno (una transacción).
  reordenar(cambios: readonly PosicionGuardada[]): Promise<ResultadoDeEscritura>
  // Un aviso nuevo se crea oculto.
  crear(datos: AvisoValidado, orden: number): Promise<ResultadoDeCreacion>
  // `visible`: cómo quedó el aviso, para el aviso breve.
  guardar(
    id: number,
    datos: AvisoValidado,
  ): Promise<{ estado: 'hecho'; visible: boolean } | RechazoDelRepositorio>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export const ERROR_DE_AVISO_INEXISTENTE =
  'No encontramos ese aviso. Puede que alguien lo haya eliminado; recarga la página.'
export const ERROR_DE_ORDEN_DE_AVISOS =
  'La lista de avisos cambió mientras ordenabas. Recarga la página e inténtalo de nuevo.'
// Por ejemplo, un aviso antiguo con un correo que hoy no pasa la validación.
export const ERROR_DE_DATOS_DEL_AVISO =
  'No se pudo guardar: el aviso tiene datos que no son válidos. Ábrelo, corrígelos y vuelve a intentarlo.'

export const TEXTOS_DE_RECHAZO_DE_AVISOS: TextosDeRechazo = {
  inexistente: ERROR_DE_AVISO_INEXISTENTE,
  invalido: ERROR_DE_DATOS_DEL_AVISO,
}

const fallo = (error: string): ResultadoDeAccionRapida => ({ ok: false, error })

function resultado(
  escritura: ResultadoDelRepositorio,
  aviso: (titulo: string) => Aviso,
): ResultadoDeAccionRapida {
  if (escritura.estado !== 'hecho')
    return fallo(textoDelRechazo(escritura, TEXTOS_DE_RECHAZO_DE_AVISOS))
  return { ok: true, aviso: aviso(escritura.nombre) }
}

export async function cambiarVisibilidadDeAviso(
  repositorio: RepositorioDeEscrituraDeAvisos,
  entrada: { id: unknown; visible: unknown },
): Promise<ResultadoDeAccionRapida> {
  const id = leerId(entrada.id)
  if (id === null) return fallo(ERROR_DE_AVISO_INEXISTENTE)
  const { visible } = entrada
  if (typeof visible !== 'boolean') return fallo(ERROR_DE_VALOR)
  const escritura = await repositorio.cambiarVisibilidad(id, visible)
  return resultado(escritura, (titulo) => avisoDeVisibilidadDeAviso(titulo, visible))
}

// Recibe la lista completa de ids en el orden nuevo. Sin cambios no escribe nada.
export async function ordenarAvisos(
  repositorio: RepositorioDeEscrituraDeAvisos,
  idsEnOrden: unknown,
): Promise<ResultadoDeAccionRapida> {
  const cambios = ordenesAActualizar(await repositorio.listarPosiciones(), idsEnOrden)
  if (cambios === null) return fallo(ERROR_DE_ORDEN_DE_AVISOS)
  if (cambios.length === 0) return { ok: true }
  const escritura = await repositorio.reordenar(cambios)
  if (escritura.estado === 'hecho') return { ok: true }
  return fallo(textoDelRechazo(escritura, TEXTOS_DE_RECHAZO_DE_AVISOS))
}

// El rol sale de la sesión del servidor, nunca del navegador.
export async function eliminarAviso(
  repositorio: RepositorioDeEscrituraDeAvisos,
  entrada: { id: unknown; rol: Rol },
): Promise<ResultadoDeAccionRapida> {
  if (!puedeEliminarEnLaGuia(entrada.rol)) return fallo(ERROR_SIN_PERMISO)
  const id = leerId(entrada.id)
  if (id === null) return fallo(ERROR_DE_AVISO_INEXISTENTE)
  return resultado(await repositorio.eliminar(id), avisoDeAvisoEliminado)
}
