'use server'

import {
  eliminarVencimiento,
  type EstadoDelGuardadoDeVencimiento,
  guardarVencimiento,
} from '../aplicacion/gestionar-vencimientos'
import type { ResultadoDeAccionRapida } from '../aplicacion/resultados-de-escritura'
import { crearEscrituraDeVencimientos } from '../infraestructura/escritura-de-vencimientos-payload'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'
import { conRevalidacion, salioBien, seGuardo } from './revalidacion'

// Escrituras de los vencimientos de la guía: sesión primero, validación en el servidor y
// permisos de la cuenta.

// `id` nulo crea un vencimiento nuevo, al final de la lista.
export async function guardarElVencimiento(
  id: unknown,
  formulario: unknown,
): Promise<EstadoDelGuardadoDeVencimiento> {
  const sesion = await exigirSesion()
  const guardado = guardarVencimiento(crearEscrituraDeVencimientos(sesion), { id, formulario })
  return conRevalidacion(guardado, seGuardo)
}

export async function eliminarElVencimiento(id: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const entrada = { id, rol: rolDeLaSesion(sesion) }
  return conRevalidacion(
    eliminarVencimiento(crearEscrituraDeVencimientos(sesion), entrada),
    salioBien,
  )
}
