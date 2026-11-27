import type {
  CollectionSlug,
  DataFromGlobalSlug,
  GlobalSlug,
  RequiredDataFromCollectionSlug,
} from 'payload'

// Lo que la carga inicial necesita de la base de datos. El cargador depende de esta interfaz
// y no de Payload (D de SOLID): en las pruebas se usa un doble en memoria y en la ejecución
// real, el adaptador de la Local API (`adaptador-payload.ts`).

// PostgreSQL usa id numéricos en todas las colecciones.
export type IdDeDocumento = number

// Igualdad campo a campo; todas las condiciones deben cumplirse.
export type Criterio = Readonly<Record<string, string | number>>

export type DatosDeColeccion<S extends CollectionSlug> = RequiredDataFromCollectionSlug<S>
export type DatosDeGlobal<S extends GlobalSlug> = Omit<DataFromGlobalSlug<S>, 'id'>

export interface PuertoDeCarga {
  buscar<S extends CollectionSlug>(coleccion: S, criterio: Criterio): Promise<IdDeDocumento | null>
  crear<S extends CollectionSlug>(
    coleccion: S,
    datos: DatosDeColeccion<S>,
    rutaDeArchivo?: string,
  ): Promise<IdDeDocumento>
  actualizar<S extends CollectionSlug>(
    coleccion: S,
    id: IdDeDocumento,
    datos: DatosDeColeccion<S>,
  ): Promise<void>
  actualizarGlobal<S extends GlobalSlug>(slug: S, datos: DatosDeGlobal<S>): Promise<void>
}

// Crea el documento si no existe o lo actualiza si ya está: así la carga se puede repetir sin
// duplicar nada. El archivo solo se sube al crear.
export async function asegurar<S extends CollectionSlug>(
  puerto: PuertoDeCarga,
  coleccion: S,
  criterio: Criterio,
  datos: DatosDeColeccion<S>,
  rutaDeArchivo?: string,
): Promise<IdDeDocumento> {
  const existente = await puerto.buscar(coleccion, criterio)
  if (existente === null) return puerto.crear(coleccion, datos, rutaDeArchivo)
  await puerto.actualizar(coleccion, existente, datos)
  return existente
}
