import type { Rol } from '@/compartido/dominio/roles'

import { RUTA_DE_LA_GUIA } from './rutas-del-panel'

// «Guía de clientes»: una sola pantalla con lo que muestra la página /guia del sitio (L4 f), en
// partes separadas que se enlazan por su ancla, como la maqueta aprobada.
export type ParteDeLaGuia = 'avisos' | 'vencimientos' | 'cronograma'

export function rutaDeLaParte(parte: ParteDeLaGuia): string {
  return `${RUTA_DE_LA_GUIA}#${parte}`
}

// Igual que mensajes, planes y sedes (L4 e): solo el administrador borra. Las colecciones dejan
// borrar al equipo, así que esta regla decide si el botón se muestra y la acción lo rechaza antes.
export function puedeEliminarEnLaGuia(rol: Rol): boolean {
  return rol === 'administrador'
}

// Tope de los textos cortos (título, obligación…); ninguno real se le acerca.
export const LARGO_MAXIMO_CORTO = 200

export const textoDemasiadoLargo = (maximo: number): string =>
  `Es demasiado largo: usa hasta ${maximo} caracteres.`

// Deja solo los campos que tienen error.
export function soloConError<C extends string>(
  errores: Readonly<Record<C, string | null>>,
): Partial<Record<C, string>> {
  const resultado: Partial<Record<C, string>> = {}
  for (const campo of Object.keys(errores) as C[]) {
    const error = errores[campo]
    if (error !== null) resultado[campo] = error
  }
  return resultado
}

// Texto de un campo que llega del navegador: sin espacios a los lados y con saltos de línea
// `\n`, o `null` si no es texto.
export const leerTexto = (valor: unknown): string | null =>
  typeof valor === 'string' ? valor.replace(/\r\n?/g, '\n').trim() : null
