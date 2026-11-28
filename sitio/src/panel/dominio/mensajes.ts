import type { Rol } from '@/compartido/dominio/roles'

import { leerId } from './identificadores'
import { RUTA_DEL_INICIO } from './rutas-del-panel'

// Mensajes de contacto en el panel: filtros, búsqueda y mensaje abierto viven en la URL, así un
// enlace o una recarga muestran lo mismo. Todo lo que llega de la URL o del navegador se valida
// aquí; nunca se confía en lo que manda el cliente.
export const RUTA_DE_MENSAJES = `${RUTA_DEL_INICIO}/mensajes`

export const ESTADOS_DE_MENSAJE = ['nuevo', 'atendido'] as const
export type EstadoDeMensaje = (typeof ESTADOS_DE_MENSAJE)[number]

export const FILTROS_DE_MENSAJES = ['nuevo', 'atendido', 'todos'] as const
export type FiltroDeMensajes = (typeof FILTROS_DE_MENSAJES)[number]

const FILTRO_PREDETERMINADO: FiltroDeMensajes = 'nuevo'
export const LARGO_MAXIMO_DE_BUSQUEDA = 100

export interface ConsultaDeMensajes {
  filtro: FiltroDeMensajes
  busqueda: string
  pagina: number
  // Id del mensaje abierto en el panel lateral.
  mensaje: number | null
}

export type ParametrosDeLaUrl = Readonly<Record<string, string | string[] | undefined>>

export const leerIdDeMensaje = leerId

export function esEstadoDeMensaje(valor: unknown): valor is EstadoDeMensaje {
  return ESTADOS_DE_MENSAJE.some((estado) => estado === valor)
}

function esFiltro(valor: unknown): valor is FiltroDeMensajes {
  return FILTROS_DE_MENSAJES.some((filtro) => filtro === valor)
}

export function estadoDelFiltro(filtro: FiltroDeMensajes): EstadoDeMensaje | null {
  return filtro === 'todos' ? null : filtro
}

const primero = (valor: string | string[] | undefined): string =>
  (Array.isArray(valor) ? valor[0] : valor) ?? ''

export function leerConsultaDeMensajes(parametros: ParametrosDeLaUrl): ConsultaDeMensajes {
  const filtro = primero(parametros.filtro)
  return {
    filtro: esFiltro(filtro) ? filtro : FILTRO_PREDETERMINADO,
    busqueda: primero(parametros.q).trim().slice(0, LARGO_MAXIMO_DE_BUSQUEDA),
    pagina: leerIdDeMensaje(primero(parametros.pagina)) ?? 1,
    mensaje: leerIdDeMensaje(primero(parametros.mensaje)),
  }
}

// Arma la URL con solo lo que difiere de lo predeterminado.
export function rutaDeMensajes(consulta: Partial<ConsultaDeMensajes>): string {
  const parametros = new URLSearchParams()
  if (consulta.filtro && consulta.filtro !== FILTRO_PREDETERMINADO)
    parametros.set('filtro', consulta.filtro)
  if (consulta.busqueda) parametros.set('q', consulta.busqueda)
  if (consulta.pagina && consulta.pagina > 1) parametros.set('pagina', String(consulta.pagina))
  if (consulta.mensaje) parametros.set('mensaje', String(consulta.mensaje))
  const texto = parametros.toString()
  return texto ? `${RUTA_DE_MENSAJES}?${texto}` : RUTA_DE_MENSAJES
}

// Hoy solo el administrador borra mensajes (L4 e). La colección lo exige igual; esta regla
// decide si el botón se muestra y la acción lo rechaza antes de llegar a Payload.
export function puedeEliminarMensajes(rol: Rol): boolean {
  return rol === 'administrador'
}
