'use server'

import {
  eliminarCronograma,
  type EstadoDelGuardadoDeCronograma,
  guardarCronograma,
} from '../aplicacion/gestionar-cronogramas'
import type { ResultadoDeAccionRapida } from '../aplicacion/resultados-de-escritura'
import { crearEscrituraDeCronogramas } from '../infraestructura/escritura-de-cronogramas-payload'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'
import { conRevalidacion, salioBien, seGuardo } from './revalidacion'

// Escrituras de los cronogramas de SUNAT: sesión primero, validación en el servidor (fechas
// estrictas, año y mes acotados) y permisos de la cuenta.

// `id` nulo carga el cronograma de un periodo nuevo.
export async function guardarElCronograma(
  id: unknown,
  formulario: unknown,
): Promise<EstadoDelGuardadoDeCronograma> {
  const sesion = await exigirSesion()
  const guardado = guardarCronograma(crearEscrituraDeCronogramas(sesion), { id, formulario })
  return conRevalidacion(guardado, seGuardo)
}

export async function eliminarElCronograma(id: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const entrada = { id, rol: rolDeLaSesion(sesion) }
  return conRevalidacion(
    eliminarCronograma(crearEscrituraDeCronogramas(sesion), entrada),
    salioBien,
  )
}
