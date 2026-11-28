import { moverEnLista } from './orden'

// Filas que se agregan, quitan y ordenan dentro de un formulario antes de guardar (los puntos de
// un área, las filas de la tabla de planes). Cada fila lleva una `clave` estable para la lista de
// React y para devolverle el foco; no se guarda.
export interface ConClave {
  clave: number
}

export function siguienteClave(filas: readonly ConClave[]): number {
  return Math.max(0, ...filas.map((f) => f.clave)) + 1
}

export function agregarFila<T extends ConClave>(filas: readonly T[], nueva: (clave: number) => T) {
  return [...filas, nueva(siguienteClave(filas))]
}

export function quitarFila<T extends ConClave>(filas: readonly T[], clave: number): T[] {
  return filas.filter((f) => f.clave !== clave)
}

export function cambiarFila<T extends ConClave>(
  filas: readonly T[],
  clave: number,
  cambio: Partial<Omit<T, 'clave'>>,
): T[] {
  return filas.map((f) => (f.clave === clave ? { ...f, ...cambio } : f))
}

export function moverFila<T>(filas: readonly T[], desde: number, hacia: number): T[] {
  return moverEnLista(filas, desde, hacia)
}
