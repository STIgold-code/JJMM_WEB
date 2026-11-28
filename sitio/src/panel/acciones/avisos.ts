'use server'

import {
  cambiarVisibilidadDeAviso,
  eliminarAviso,
  ordenarAvisos,
} from '../aplicacion/gestionar-avisos'
import { type EstadoDelGuardadoDeAviso, guardarAviso } from '../aplicacion/guardar-aviso'
import type { ResultadoDeAccionRapida } from '../aplicacion/resultados-de-escritura'
import { crearEscrituraDeAvisos } from '../infraestructura/escritura-de-avisos-payload'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'
import { conRevalidacion, salioBien, seGuardo } from './revalidacion'

// Escrituras de los avisos de la guía. Cada una exige la sesión primero (sin ella, `redirect`
// corta antes de tocar Payload), valida en el servidor lo que llega del navegador y escribe con
// los permisos de la cuenta.
export async function cambiarVisibilidadDelAviso(
  id: unknown,
  visible: unknown,
): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const repositorio = crearEscrituraDeAvisos(sesion)
  return conRevalidacion(cambiarVisibilidadDeAviso(repositorio, { id, visible }), salioBien)
}

export async function ordenarLosAvisos(idsEnOrden: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  return conRevalidacion(ordenarAvisos(crearEscrituraDeAvisos(sesion), idsEnOrden), salioBien)
}

export async function eliminarElAviso(id: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const entrada = { id, rol: rolDeLaSesion(sesion) }
  return conRevalidacion(eliminarAviso(crearEscrituraDeAvisos(sesion), entrada), salioBien)
}

// `id` nulo crea un aviso nuevo.
export async function guardarElAviso(
  id: unknown,
  formulario: unknown,
): Promise<EstadoDelGuardadoDeAviso> {
  const sesion = await exigirSesion()
  return conRevalidacion(guardarAviso(crearEscrituraDeAvisos(sesion), { id, formulario }), seGuardo)
}
