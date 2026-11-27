'use server'

import { revalidatePath } from 'next/cache'

import {
  cambiarEstadoDeMensaje,
  eliminarMensaje,
  type ResultadoDeAccion,
} from '../aplicacion/gestionar-mensajes'
import {
  type EstadoDeDatosDeContacto,
  guardarDatosDeContacto,
} from '../aplicacion/guardar-datos-de-contacto'
import { RUTA_DEL_INICIO } from '../dominio/rutas-del-panel'
import { crearRepositorioDeMensajes } from '../infraestructura/repositorio-de-mensajes-payload'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'

// Escrituras de la pantalla de mensajes. Cada una exige la sesión primero (sin ella, `redirect`
// corta antes de tocar Payload), valida en el servidor lo que llega del navegador y escribe con
// los permisos de la cuenta. Tras escribir se revalida todo el panel: el listado y sus conteos,
// el contador del menú y el inicio. Los mensajes no se leen en el sitio público, así que no hay
// etiquetas de caché que invalidar (`COLECCIONES_SIN_REVALIDACION`).
function revalidarElPanel(): void {
  revalidatePath(RUTA_DEL_INICIO, 'layout')
}

export async function cambiarEstadoDelMensaje(
  id: unknown,
  estado: unknown,
): Promise<ResultadoDeAccion> {
  const sesion = await exigirSesion()
  const resultado = await cambiarEstadoDeMensaje(crearRepositorioDeMensajes(sesion), { id, estado })
  if (resultado.ok) revalidarElPanel()
  return resultado
}

export async function eliminarElMensaje(id: unknown): Promise<ResultadoDeAccion> {
  const sesion = await exigirSesion()
  const resultado = await eliminarMensaje(crearRepositorioDeMensajes(sesion), {
    id,
    rol: rolDeLaSesion(sesion),
  })
  if (resultado.ok) revalidarElPanel()
  return resultado
}

export async function guardarContactoDelMensaje(
  _estadoPrevio: EstadoDeDatosDeContacto,
  datos: FormData,
): Promise<EstadoDeDatosDeContacto> {
  const sesion = await exigirSesion()
  const resultado = await guardarDatosDeContacto(crearRepositorioDeMensajes(sesion), {
    id: datos.get('id'),
    celular: datos.get('celular'),
    correo: datos.get('correo'),
  })
  if (resultado.estado === 'guardado') revalidarElPanel()
  return resultado
}
