import type { CollectionSlug } from 'payload'

import {
  asegurar,
  type Criterio,
  type DatosDeColeccion,
  type IdDeDocumento,
  type PuertoDeCarga,
} from '../puerto-de-carga'

// Carga una lista ordenable: el `orden` de cada documento es su posición (1, 2, 3…) y la clave
// natural de cada uno decide si se crea o se actualiza.
export async function cargarEnOrden<S extends CollectionSlug, T>(
  puerto: PuertoDeCarga,
  coleccion: S,
  elementos: readonly T[],
  aDocumento: (elemento: T, orden: number) => DatosDeColeccion<S>,
  claveNatural: (elemento: T) => Criterio,
): Promise<IdDeDocumento[]> {
  const ids: IdDeDocumento[] = []
  for (const [indice, elemento] of elementos.entries()) {
    const datos = aDocumento(elemento, indice + 1)
    ids.push(await asegurar(puerto, coleccion, claveNatural(elemento), datos))
  }
  return ids
}
