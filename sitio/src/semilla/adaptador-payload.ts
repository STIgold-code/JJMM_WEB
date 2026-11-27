import type { Payload, TypedCollectionSelect, TypedGlobalSelect, Where } from 'payload'

import { CONTEXTO_SIN_REVALIDACION } from '@/compartido/infraestructura/revalidacion/hooks-de-revalidacion'

import type { Criterio, PuertoDeCarga } from './puerto-de-carga'

const aWhere = (criterio: Criterio): Where => ({
  and: Object.entries(criterio).map(([campo, valor]) => ({ [campo]: { equals: valor } })),
})

// La carga es una tarea del equipo, no de un visitante: por eso usa `overrideAccess` (es el
// valor por defecto de la Local API, aquí queda explícito). Corre con `payload run`, fuera de
// Next, donde `revalidateTag` fallaría: el contexto apaga los hooks de revalidación. Si el
// sitio ya estaba sirviendo, su caché se renueva sola en 10 minutos como máximo.
const OPCIONES = { depth: 0, overrideAccess: true, context: CONTEXTO_SIN_REVALIDACION } as const

// Implementa el puerto de carga con la Local API de Payload.
export function crearPuertoPayload(payload: Payload): PuertoDeCarga {
  return {
    async buscar(coleccion, criterio) {
      const { docs } = await payload.find({
        collection: coleccion,
        where: aWhere(criterio),
        limit: 1,
        ...OPCIONES,
      })
      return docs[0]?.id ?? null
    },
    async crear(coleccion, datos, rutaDeArchivo) {
      const documento = await payload.create({
        collection: coleccion,
        data: datos,
        filePath: rutaDeArchivo,
        ...OPCIONES,
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
      await payload.update({ collection: coleccion, id, data: datos as Datos, ...OPCIONES })
    },
    async actualizarGlobal(slug, datos) {
      type S = typeof slug
      type Datos = Parameters<typeof payload.updateGlobal<S, TypedGlobalSelect[S]>>[0]['data']
      await payload.updateGlobal({ slug, data: datos as Datos, ...OPCIONES })
    },
  }
}
