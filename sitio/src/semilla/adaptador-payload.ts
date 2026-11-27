import type { Payload, TypedCollectionSelect, TypedGlobalSelect, Where } from 'payload'

import type { Criterio, PuertoDeCarga } from './puerto-de-carga'

const aWhere = (criterio: Criterio): Where => ({
  and: Object.entries(criterio).map(([campo, valor]) => ({ [campo]: { equals: valor } })),
})

// Implementa el puerto de carga con la Local API de Payload. La carga es una tarea del
// equipo, no de un visitante: por eso usa `overrideAccess` (es el valor por defecto de la
// Local API, aquí queda explícito).
export function crearPuertoPayload(payload: Payload): PuertoDeCarga {
  return {
    async buscar(coleccion, criterio) {
      const { docs } = await payload.find({
        collection: coleccion,
        where: aWhere(criterio),
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      return docs[0]?.id ?? null
    },
    async crear(coleccion, datos, rutaDeArchivo) {
      const documento = await payload.create({
        collection: coleccion,
        data: datos,
        filePath: rutaDeArchivo,
        depth: 0,
        overrideAccess: true,
      })
      return documento.id
    },
    // `update` y `updateGlobal` reciben un DeepPartial del documento. El documento completo lo
    // cumple, pero TypeScript no puede probarlo con un slug genérico: de ahí las aserciones al
    // tipo exacto que pide cada función.
    async actualizar(coleccion, id, datos) {
      type S = typeof coleccion
      // `update` tiene dos firmas; `Parameters` toma la última, la de actualizar por id.
      type Datos = Parameters<typeof payload.update<S, TypedCollectionSelect[S]>>[0]['data']
      await payload.update({
        collection: coleccion,
        id,
        data: datos as Datos,
        depth: 0,
        overrideAccess: true,
      })
    },
    async actualizarGlobal(slug, datos) {
      type S = typeof slug
      type Datos = Parameters<typeof payload.updateGlobal<S, TypedGlobalSelect[S]>>[0]['data']
      await payload.updateGlobal({ slug, data: datos as Datos, depth: 0, overrideAccess: true })
    },
  }
}
