import type { Rol } from '@/compartido/dominio/roles'

import { esEstadoDeMensaje, leerIdDeMensaje, puedeEliminarMensajes } from '../dominio/mensajes'
import type { EstadoDeMensaje } from '../dominio/mensajes'
import {
  type Aviso,
  avisoDeCambioDeEstado,
  type DatosDeContacto,
} from '../dominio/respuesta-al-mensaje'

// Escrituras sobre los mensajes. Todo lo que llega del navegador es `unknown` y se valida aquí;
// el repositorio escribe con los permisos de la sesión, así la colección tiene la última palabra.
export type CambiosDelMensaje = Partial<{ estado: EstadoDeMensaje } & DatosDeContacto>

// `invalido`: la colección rechazó los datos al guardar; `campos` nombra los que rechazó.
export type ResultadoDelRepositorio =
  | { estado: 'hecho'; nombre: string }
  | { estado: 'no-encontrado' }
  | { estado: 'prohibido' }
  | { estado: 'invalido'; campos: string[] }

export interface RepositorioDeEscrituraDeMensajes {
  actualizar(id: number, cambios: CambiosDelMensaje): Promise<ResultadoDelRepositorio>
  eliminar(id: number): Promise<ResultadoDelRepositorio>
}

export type ResultadoDeAccion = { ok: true; aviso: Aviso } | { ok: false; error: string }

export const ERROR_DE_MENSAJE_INEXISTENTE =
  'No encontramos ese mensaje. Puede que alguien lo haya eliminado; recarga la página.'
export const ERROR_SIN_PERMISO = 'Tu cuenta no tiene permiso para hacer esto.'
export const ERROR_DE_ESTADO = 'Ese estado no existe. Recarga la página e inténtalo de nuevo.'
// Por ejemplo, un mensaje antiguo con un celular o un correo que hoy no pasa la validación.
export const ERROR_DE_DATOS_GUARDADOS =
  'No se pudo guardar: el mensaje tiene un celular o un correo que no es válido. Corrígelo en «Datos de contacto» e inténtalo de nuevo.'

const fallo = (error: string): ResultadoDeAccion => ({ ok: false, error })

// Traduce el resultado del repositorio: el aviso solo se arma si se escribió.
export function resultadoDeEscritura(
  resultado: ResultadoDelRepositorio,
  aviso: (nombre: string) => Aviso,
): ResultadoDeAccion {
  if (resultado.estado === 'no-encontrado') return fallo(ERROR_DE_MENSAJE_INEXISTENTE)
  if (resultado.estado === 'prohibido') return fallo(ERROR_SIN_PERMISO)
  if (resultado.estado === 'invalido') return fallo(ERROR_DE_DATOS_GUARDADOS)
  return { ok: true, aviso: aviso(resultado.nombre) }
}

export async function cambiarEstadoDeMensaje(
  repositorio: RepositorioDeEscrituraDeMensajes,
  entrada: { id: unknown; estado: unknown },
): Promise<ResultadoDeAccion> {
  const id = leerIdDeMensaje(entrada.id)
  if (id === null) return fallo(ERROR_DE_MENSAJE_INEXISTENTE)
  const { estado } = entrada
  if (!esEstadoDeMensaje(estado)) return fallo(ERROR_DE_ESTADO)
  const resultado = await repositorio.actualizar(id, { estado })
  return resultadoDeEscritura(resultado, (nombre) => avisoDeCambioDeEstado(nombre, estado))
}

// El rol sale de la sesión del servidor, nunca del navegador.
export async function eliminarMensaje(
  repositorio: RepositorioDeEscrituraDeMensajes,
  entrada: { id: unknown; rol: Rol },
): Promise<ResultadoDeAccion> {
  if (!puedeEliminarMensajes(entrada.rol)) return fallo(ERROR_SIN_PERMISO)
  const id = leerIdDeMensaje(entrada.id)
  if (id === null) return fallo(ERROR_DE_MENSAJE_INEXISTENTE)
  const resultado = await repositorio.eliminar(id)
  return resultadoDeEscritura(resultado, (nombre) => ({ titulo: `Mensaje de ${nombre} eliminado` }))
}
