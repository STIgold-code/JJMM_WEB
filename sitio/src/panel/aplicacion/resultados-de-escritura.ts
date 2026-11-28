import type { Aviso } from '../dominio/respuesta-al-mensaje'
import { ERROR_SIN_PERMISO, type ResultadoDelRepositorio } from './gestionar-mensajes'

// Resultados comunes de las escrituras del panel (planes, sedes). El repositorio nunca lanza por
// datos rechazados: devuelve el rechazo tipado y el caso de uso lo traduce a un texto.
export type RechazoDelRepositorio = Exclude<ResultadoDelRepositorio, { estado: 'hecho' }>
export type ResultadoDeEscritura = { estado: 'hecho' } | RechazoDelRepositorio
export type ResultadoDeCreacion = { estado: 'hecho'; id: number } | RechazoDelRepositorio

export const ERROR_DE_VALOR = 'Ese valor no es válido. Recarga la página e inténtalo de nuevo.'

// Respuesta de una acción rápida de un listado (interruptor, orden, borrado).
export type ResultadoDeAccionRapida = { ok: true; aviso?: Aviso } | { ok: false; error: string }

// Respuesta de un formulario que se guarda en un panel lateral (guía de clientes). `E` son los
// errores por campo, con `general` para lo que no tiene campo.
export type EstadoDelGuardado<E> =
  | { estado: 'guardado'; aviso: Aviso }
  | { estado: 'invalido'; errores: E }
  | { estado: 'error'; error: string }

// Textos de cada colección para un rechazo del repositorio.
export interface TextosDeRechazo {
  inexistente: string
  invalido: string
}

export function textoDelRechazo(rechazo: RechazoDelRepositorio, textos: TextosDeRechazo): string {
  if (rechazo.estado === 'no-encontrado') return textos.inexistente
  if (rechazo.estado === 'prohibido') return ERROR_SIN_PERMISO
  return textos.invalido
}

// Lo que la colección rechazó (un 400) va junto a su campo del formulario, con el texto del
// panel. Un campo que el panel no conoce no tiene dónde mostrarse: queda como error general.
export function estadoDelRechazo<E extends object>(
  rechazo: RechazoDelRepositorio,
  erroresDelCampo: (campo: string) => Partial<E> | undefined,
  textos: TextosDeRechazo,
): EstadoDelGuardado<Partial<E>> {
  if (rechazo.estado === 'invalido') {
    const errores = rechazo.campos.reduce<Partial<E>>(
      (todos, campo) => ({ ...todos, ...erroresDelCampo(campo) }),
      {},
    )
    if (Object.keys(errores).length > 0) return { estado: 'invalido', errores }
  }
  return { estado: 'error', error: textoDelRechazo(rechazo, textos) }
}
