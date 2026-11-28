'use server'

import { revalidatePath } from 'next/cache'

import { cambiarVisibilidadDeSede, eliminarSede, ordenarSedes } from '../aplicacion/gestionar-sedes'
import { crearSede, type EstadoDelGuardadoDeSede, guardarSede } from '../aplicacion/guardar-sede'
import type { ResultadoDeAccionRapida } from '../aplicacion/resultados-de-escritura'
import { RUTA_DEL_INICIO } from '../dominio/rutas-del-panel'
import { crearEscrituraDeSedes } from '../infraestructura/escritura-de-sedes-payload'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'

// Escrituras de la pantalla de sedes. Cada una exige la sesión primero (sin ella, `redirect`
// corta antes de tocar Payload), valida en el servidor lo que llega del navegador y escribe con
// los permisos de la cuenta. Tras escribir se revalida el panel (listado, edición, inicio); la
// caché del sitio público la invalidan los hooks de la colección, que corren dentro de Next.
async function conRevalidacion<T>(escribir: Promise<T>, escribio: (resultado: T) => boolean) {
  const resultado = await escribir
  if (escribio(resultado)) revalidatePath(RUTA_DEL_INICIO, 'layout')
  return resultado
}

const salioBien = (resultado: ResultadoDeAccionRapida) => resultado.ok

export async function cambiarVisibilidadDeLaSede(
  id: unknown,
  visible: unknown,
): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const repositorio = crearEscrituraDeSedes(sesion)
  return conRevalidacion(cambiarVisibilidadDeSede(repositorio, { id, visible }), salioBien)
}

export async function ordenarLasSedes(idsEnOrden: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  return conRevalidacion(ordenarSedes(crearEscrituraDeSedes(sesion), idsEnOrden), salioBien)
}

export async function eliminarLaSede(id: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const entrada = { id, rol: rolDeLaSesion(sesion) }
  return conRevalidacion(eliminarSede(crearEscrituraDeSedes(sesion), entrada), salioBien)
}

export async function guardarLaSede(
  id: unknown,
  formulario: unknown,
): Promise<EstadoDelGuardadoDeSede> {
  const sesion = await exigirSesion()
  const guardado = guardarSede(crearEscrituraDeSedes(sesion), { id, formulario })
  return conRevalidacion(guardado, (resultado) => resultado.estado === 'guardado')
}

export async function crearLaSede(formulario: unknown): Promise<EstadoDelGuardadoDeSede> {
  const sesion = await exigirSesion()
  const creacion = crearSede(crearEscrituraDeSedes(sesion), { formulario })
  return conRevalidacion(creacion, (resultado) => resultado.estado === 'creado')
}
