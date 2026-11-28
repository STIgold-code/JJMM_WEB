import { leerId } from './identificadores'

// Orden de los planes: el campo numérico `orden` (menor primero). El listado manda la lista
// completa de ids en el orden nuevo; el servidor la valida contra lo guardado y escribe solo
// los planes cuyo número cambia.
export interface PosicionGuardada {
  id: number
  orden: number
}

// Copia de `lista` con el elemento de `desde` movido a `hacia`. Fuera de los bordes, sin cambios.
export function moverEnLista<T>(lista: readonly T[], desde: number, hacia: number): T[] {
  const copia = [...lista]
  const fuera = (indice: number) => indice < 0 || indice >= lista.length
  if (fuera(desde) || fuera(hacia) || desde === hacia) return copia
  const [movido] = copia.splice(desde, 1)
  if (movido !== undefined) copia.splice(hacia, 0, movido)
  return copia
}

// Ids válidos y sin repetir, o `null`.
function leerIds(valor: unknown): number[] | null {
  if (!Array.isArray(valor)) return null
  const ids = valor.map(leerId)
  if (ids.some((id) => id === null)) return null
  const validos = ids.filter((id): id is number => id !== null)
  return new Set(validos).size === validos.length ? validos : null
}

// `null` si `idsEnOrden` no es exactamente la lista de planes guardados (falta, sobra o se
// repite alguno): alguien cambió la lista mientras tanto y no se adivina qué quiso hacer.
export function ordenesAActualizar(
  guardados: readonly PosicionGuardada[],
  idsEnOrden: unknown,
): PosicionGuardada[] | null {
  const ids = leerIds(idsEnOrden)
  if (!ids || ids.length !== guardados.length) return null
  const ordenActual = new Map(guardados.map(({ id, orden }) => [id, orden]))
  if (ids.some((id) => !ordenActual.has(id))) return null
  return ids.flatMap((id, orden) => (ordenActual.get(id) === orden ? [] : [{ id, orden }]))
}
