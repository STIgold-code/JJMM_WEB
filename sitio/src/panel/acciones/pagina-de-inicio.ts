'use server'

import {
  type EstadoDelGuardadoDelInicio,
  guardarCarrusel,
  ordenarSecciones,
} from '../aplicacion/guardar-pagina-de-inicio'
import type { ErroresDelCarrusel } from '../dominio/errores-del-carrusel'
import { crearEscrituraDeLaPaginaDeInicio } from '../infraestructura/escritura-de-la-pagina-de-inicio-payload'
import { exigirSesion } from '../infraestructura/sesion-del-panel'
import { conRevalidacion, seGuardo } from './revalidacion'

// Escrituras de la página de inicio. Cada una exige la sesión primero (sin ella, `redirect` corta
// antes de tocar Payload), valida en el servidor lo que llega del navegador y escribe con los
// permisos de la cuenta (la global la actualiza todo el equipo: `soloEquipo`). Del navegador solo
// se toman los campos del carrusel o el orden; el resto de la página se lee de lo guardado.
export async function guardarElCarrusel(
  formulario: unknown,
): Promise<EstadoDelGuardadoDelInicio<ErroresDelCarrusel>> {
  const sesion = await exigirSesion()
  const repositorio = crearEscrituraDeLaPaginaDeInicio(sesion)
  return conRevalidacion(guardarCarrusel(repositorio, formulario), seGuardo)
}

export async function ordenarLasSecciones(
  ids: unknown,
  actualizadoEn: unknown,
): Promise<EstadoDelGuardadoDelInicio<never>> {
  const sesion = await exigirSesion()
  const repositorio = crearEscrituraDeLaPaginaDeInicio(sesion)
  return conRevalidacion(ordenarSecciones(repositorio, { ids, actualizadoEn }), seGuardo)
}
