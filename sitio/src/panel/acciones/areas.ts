'use server'

import {
  type EstadoDelGuardadoDeArea,
  guardarArea,
  ordenarAreas,
} from '../aplicacion/gestionar-areas'
import type { ResultadoDeAccionRapida } from '../aplicacion/resultados-de-escritura'
import { crearEscrituraDeAreas } from '../infraestructura/escritura-de-areas-payload'
import { exigirSesion } from '../infraestructura/sesion-del-panel'
import { conRevalidacion, salioBien, seGuardo } from './revalidacion'

// Escrituras de las áreas de servicio. Cada una exige la sesión primero (sin ella, `redirect`
// corta antes de tocar Payload), valida en el servidor lo que llega del navegador y escribe con
// los permisos de la cuenta. No hay crear ni eliminar: las nueve áreas son los gajos de la rueda.
export async function ordenarLasAreas(idsEnOrden: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  return conRevalidacion(ordenarAreas(crearEscrituraDeAreas(sesion), idsEnOrden), salioBien)
}

export async function guardarElArea(
  id: unknown,
  formulario: unknown,
): Promise<EstadoDelGuardadoDeArea> {
  const sesion = await exigirSesion()
  return conRevalidacion(guardarArea(crearEscrituraDeAreas(sesion), { id, formulario }), seGuardo)
}
