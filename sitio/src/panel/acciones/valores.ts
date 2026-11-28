'use server'

import {
  eliminarValor,
  type EstadoDelGuardadoDeValor,
  guardarValor,
  ordenarValores,
} from '../aplicacion/gestionar-valores'
import type { ResultadoDeAccionRapida } from '../aplicacion/resultados-de-escritura'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'
import { crearRepositorioDeValores } from '../infraestructura/valores-payload'
import { conRevalidacion, salioBien, seGuardo } from './revalidacion'

// Escrituras de los valores de «¿Por qué elegirnos?». Cada una exige la sesión primero (sin ella,
// `redirect` corta antes de tocar Payload), valida en el servidor lo que llega del navegador y
// escribe con los permisos de la cuenta.
export async function ordenarLosValores(idsEnOrden: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  return conRevalidacion(ordenarValores(crearRepositorioDeValores(sesion), idsEnOrden), salioBien)
}

// `id` nulo crea un valor nuevo.
export async function guardarElValor(
  id: unknown,
  formulario: unknown,
): Promise<EstadoDelGuardadoDeValor> {
  const sesion = await exigirSesion()
  const guardado = guardarValor(crearRepositorioDeValores(sesion), { id, formulario })
  return conRevalidacion(guardado, seGuardo)
}

export async function eliminarElValor(id: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const entrada = { id, rol: rolDeLaSesion(sesion) }
  return conRevalidacion(eliminarValor(crearRepositorioDeValores(sesion), entrada), salioBien)
}
