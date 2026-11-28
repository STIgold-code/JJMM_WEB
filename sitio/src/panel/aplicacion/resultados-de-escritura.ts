import type { Aviso } from '../dominio/respuesta-al-mensaje'
import type { ResultadoDelRepositorio } from './gestionar-mensajes'

// Resultados comunes de las escrituras del panel (planes, sedes). El repositorio nunca lanza por
// datos rechazados: devuelve el rechazo tipado y el caso de uso lo traduce a un texto.
export type RechazoDelRepositorio = Exclude<ResultadoDelRepositorio, { estado: 'hecho' }>
export type ResultadoDeEscritura = { estado: 'hecho' } | RechazoDelRepositorio
export type ResultadoDeCreacion = { estado: 'hecho'; id: number } | RechazoDelRepositorio

export const ERROR_DE_VALOR = 'Ese valor no es válido. Recarga la página e inténtalo de nuevo.'

// Respuesta de una acción rápida de un listado (interruptor, orden, borrado).
export type ResultadoDeAccionRapida = { ok: true; aviso?: Aviso } | { ok: false; error: string }
