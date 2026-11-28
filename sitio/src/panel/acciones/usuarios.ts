'use server'

import { revalidatePath } from 'next/cache'

import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { eliminarUsuario } from '../aplicacion/gestionar-usuarios'
import {
  crearUsuario,
  type EstadoDelFormularioDeUsuario,
  guardarUsuario,
} from '../aplicacion/guardar-usuario'
import type { ResultadoDeAccionRapida } from '../aplicacion/resultados-de-escritura'
import { RUTA_DEL_INICIO } from '../dominio/rutas-del-panel'
import { exigirAdministrador } from '../infraestructura/sesion-del-panel'
import { crearRepositorioDeUsuarios } from '../infraestructura/usuarios-payload'

// Escrituras de la pantalla «Usuarios», solo del administrador. Cada una pasa primero por
// `exigirAdministrador` (sin sesión redirige al ingreso; con la de un editor no escribe nada), toma
// la cuenta que actúa de la sesión del servidor y valida todo lo demás como dato hostil. Tras
// escribir se revalida el panel (listado, menú, inicio).
const SIN_PERMISO = { ok: false, error: ERROR_SIN_PERMISO } as const
const FORMULARIO_SIN_PERMISO = { estado: 'error', error: ERROR_SIN_PERMISO } as const

function revalidarSiGuardo(estado: EstadoDelFormularioDeUsuario) {
  if (estado.estado === 'guardado') revalidatePath(RUTA_DEL_INICIO, 'layout')
  return estado
}

export async function crearElUsuario(formulario: unknown): Promise<EstadoDelFormularioDeUsuario> {
  const sesion = await exigirAdministrador()
  if (!sesion) return FORMULARIO_SIN_PERMISO
  return revalidarSiGuardo(await crearUsuario(crearRepositorioDeUsuarios(sesion), formulario))
}

export async function guardarElUsuario(
  id: unknown,
  formulario: unknown,
): Promise<EstadoDelFormularioDeUsuario> {
  const sesion = await exigirAdministrador()
  if (!sesion) return FORMULARIO_SIN_PERMISO
  const entrada = { id, formulario, actor: sesion.usuario.id }
  return revalidarSiGuardo(await guardarUsuario(crearRepositorioDeUsuarios(sesion), entrada))
}

export async function eliminarElUsuario(id: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirAdministrador()
  if (!sesion) return SIN_PERMISO
  const entrada = { id, actor: sesion.usuario.id }
  const resultado = await eliminarUsuario(crearRepositorioDeUsuarios(sesion), entrada)
  if (resultado.ok) revalidatePath(RUTA_DEL_INICIO, 'layout')
  return resultado
}
