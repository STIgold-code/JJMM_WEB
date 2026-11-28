'use server'

import {
  cambiarVisibilidadDeCliente,
  eliminarCliente,
  type EstadoDelGuardadoDeCliente,
  guardarCliente,
  ordenarClientes,
} from '../aplicacion/gestionar-clientes'
import type { ResultadoDeAccionRapida } from '../aplicacion/resultados-de-escritura'
import { crearRepositorioDeClientes } from '../infraestructura/clientes-payload'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'
import { conRevalidacion, salioBien, seGuardo } from './revalidacion'

// Escrituras de los clientes del carrusel. Cada una exige la sesión primero (sin ella, `redirect`
// corta antes de tocar Payload), valida en el servidor lo que llega del navegador y escribe con
// los permisos de la cuenta.
export async function cambiarVisibilidadDelCliente(
  id: unknown,
  visible: unknown,
): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const repositorio = crearRepositorioDeClientes(sesion)
  return conRevalidacion(cambiarVisibilidadDeCliente(repositorio, { id, visible }), salioBien)
}

export async function ordenarLosClientes(idsEnOrden: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  return conRevalidacion(ordenarClientes(crearRepositorioDeClientes(sesion), idsEnOrden), salioBien)
}

// `id` nulo crea un cliente nuevo.
export async function guardarElCliente(
  id: unknown,
  formulario: unknown,
): Promise<EstadoDelGuardadoDeCliente> {
  const sesion = await exigirSesion()
  const guardado = guardarCliente(crearRepositorioDeClientes(sesion), { id, formulario })
  return conRevalidacion(guardado, seGuardo)
}

export async function eliminarElCliente(id: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const entrada = { id, rol: rolDeLaSesion(sesion) }
  return conRevalidacion(eliminarCliente(crearRepositorioDeClientes(sesion), entrada), salioBien)
}
