'use server'

import { revalidatePath } from 'next/cache'

import {
  cambiarVisibilidadDePlan,
  eliminarPlan,
  ordenarPlanes,
  type ResultadoDeAccionDePlan,
} from '../aplicacion/gestionar-planes'
import {
  crearPlan,
  type EstadoDeCreacion,
  type EstadoDelGuardado,
  guardarPlan,
} from '../aplicacion/guardar-plan'
import { RUTA_DEL_INICIO } from '../dominio/rutas-del-panel'
import { crearEscrituraDePlanes } from '../infraestructura/escritura-de-planes-payload'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'

// Escrituras de la pantalla de planes. Cada una exige la sesión primero (sin ella, `redirect`
// corta antes de tocar Payload), valida en el servidor lo que llega del navegador y escribe con
// los permisos de la cuenta. Tras escribir se revalida el panel (listado, edición, inicio); la
// caché del sitio público la invalidan los hooks de las colecciones, que corren dentro de Next.
function revalidarElPanel(): void {
  revalidatePath(RUTA_DEL_INICIO, 'layout')
}

async function conRevalidacion<T>(escribir: Promise<T>, escribio: (resultado: T) => boolean) {
  const resultado = await escribir
  if (escribio(resultado)) revalidarElPanel()
  return resultado
}

const salioBien = (resultado: ResultadoDeAccionDePlan) => resultado.ok

export async function cambiarVisibilidadDelPlan(
  id: unknown,
  visible: unknown,
): Promise<ResultadoDeAccionDePlan> {
  const sesion = await exigirSesion()
  const repositorio = crearEscrituraDePlanes(sesion)
  return conRevalidacion(cambiarVisibilidadDePlan(repositorio, { id, visible }), salioBien)
}

export async function ordenarLosPlanes(idsEnOrden: unknown): Promise<ResultadoDeAccionDePlan> {
  const sesion = await exigirSesion()
  return conRevalidacion(ordenarPlanes(crearEscrituraDePlanes(sesion), idsEnOrden), salioBien)
}

export async function eliminarElPlan(id: unknown): Promise<ResultadoDeAccionDePlan> {
  const sesion = await exigirSesion()
  const entrada = { id, rol: rolDeLaSesion(sesion) }
  return conRevalidacion(eliminarPlan(crearEscrituraDePlanes(sesion), entrada), salioBien)
}

export async function guardarElPlan(id: unknown, formulario: unknown): Promise<EstadoDelGuardado> {
  const sesion = await exigirSesion()
  const guardado = guardarPlan(crearEscrituraDePlanes(sesion), { id, formulario })
  return conRevalidacion(guardado, (resultado) => resultado.estado === 'guardado')
}

export async function crearElPlan(
  _estadoPrevio: EstadoDeCreacion,
  datos: FormData,
): Promise<EstadoDeCreacion> {
  const sesion = await exigirSesion()
  const creacion = crearPlan(crearEscrituraDePlanes(sesion), { nombre: datos.get('nombre') })
  return conRevalidacion(creacion, (resultado) => resultado.estado === 'creado')
}
