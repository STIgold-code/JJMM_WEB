'use server'

import { type EstadoDelGuardadoDeFilas, guardarFilas } from '../aplicacion/gestionar-filas'
import { crearEscrituraDeFilas } from '../infraestructura/escritura-de-filas-payload'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'
import { conRevalidacion, seGuardo } from './revalidacion'

// Guardar las filas de la tabla de planes (renombrar, ordenar, agregar y quitar, todo junto). Exige
// la sesión primero (sin ella, `redirect` corta antes de tocar Payload), valida en el servidor lo
// que llega del navegador, toma el rol de la sesión (solo el administrador quita filas) y escribe
// con los permisos de la cuenta, en una transacción.
export async function guardarLasFilas(formulario: unknown): Promise<EstadoDelGuardadoDeFilas> {
  const sesion = await exigirSesion()
  const entrada = { formulario, rol: rolDeLaSesion(sesion) }
  return conRevalidacion(guardarFilas(crearEscrituraDeFilas(sesion), entrada), seGuardo)
}
