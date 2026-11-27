import { describe, expect, it, vi } from 'vitest'

import {
  CONTEXTO_SIN_REVALIDACION,
  crearHooksDeRevalidacion,
  type EstadoPublico,
} from './hooks-de-revalidacion'

interface Solicitud {
  nombre: string
}

const REQ: Solicitud = { nombre: 'solicitud' }

function preparar(estadoPublico: EstadoPublico | null = null) {
  const revalidar = vi.fn<(etiqueta: string) => void>()
  const leerEstadoPublico = vi.fn(async () => estadoPublico)
  const hooks = crearHooksDeRevalidacion<Solicitud>({ revalidar, leerEstadoPublico })
  const revalidadas = () => revalidar.mock.calls.map(([etiqueta]) => etiqueta)
  return { hooks, revalidadas, leerEstadoPublico }
}

describe('colección sin borradores', () => {
  const opciones = { slug: 'planes', conBorradores: false }

  it('crear, actualizar y borrar invalidan la etiqueta de la colección', async () => {
    const { hooks, revalidadas } = preparar()
    const { despuesDeCambiar, despuesDeBorrar } = hooks.paraColeccion(opciones)
    const doc = { id: 1 }
    await despuesDeCambiar({ context: {}, doc, previousDoc: doc, operation: 'create' })
    await despuesDeCambiar({ context: {}, doc, previousDoc: doc, operation: 'update' })
    await despuesDeBorrar({ context: {}, doc })
    expect(revalidadas()).toEqual(['coleccion:planes', 'coleccion:planes', 'coleccion:planes'])
  })

  it('no lee el estado público ni agrega un hook previo', () => {
    const { hooks } = preparar()
    expect(hooks.paraColeccion(opciones).antesDeCambiar).toBeNull()
  })

  it('no invalida nada si el contexto lo pide (carga inicial)', async () => {
    const { hooks, revalidadas } = preparar()
    const { despuesDeCambiar, despuesDeBorrar } = hooks.paraColeccion(opciones)
    const context = { ...CONTEXTO_SIN_REVALIDACION }
    await despuesDeCambiar({ context, doc: { id: 1 }, previousDoc: { id: 1 }, operation: 'update' })
    await despuesDeBorrar({ context, doc: { id: 1 } })
    expect(revalidadas()).toEqual([])
  })
})

describe('publicaciones (con borradores y etiqueta por documento)', () => {
  const opciones = { slug: 'publicaciones', conBorradores: true }

  async function actualizar(estadoPublico: EstadoPublico | null, doc: Record<string, unknown>) {
    const preparado = preparar(estadoPublico)
    const { antesDeCambiar, despuesDeCambiar } = preparado.hooks.paraColeccion(opciones)
    const context: Record<string, unknown> = {}
    const anterior = { id: 7, slug: 'borrador-intermedio', _status: 'draft' }
    const datos = { titulo: 'x' }
    const devuelto = await antesDeCambiar?.({
      context,
      data: datos,
      operation: 'update',
      originalDoc: anterior,
      req: REQ,
    })
    expect(devuelto).toBe(datos)
    await despuesDeCambiar({
      context,
      doc: { id: 7, ...doc },
      previousDoc: anterior,
      operation: 'update',
    })
    return preparado
  }

  it('un borrador de una publicación que nunca fue pública no invalida nada', async () => {
    const { revalidadas } = await actualizar(
      { publicada: false, slug: 'nueva' },
      {
        _status: 'draft',
        slug: 'nueva',
      },
    )
    expect(revalidadas()).toEqual([])
  })

  it('crear un borrador no invalida nada ni consulta el estado público', async () => {
    const { hooks, revalidadas, leerEstadoPublico } = preparar()
    const { antesDeCambiar, despuesDeCambiar } = hooks.paraColeccion(opciones)
    const context: Record<string, unknown> = {}
    await antesDeCambiar?.({
      context,
      data: {},
      operation: 'create',
      originalDoc: undefined,
      req: REQ,
    })
    const doc = { id: 8, slug: 'nueva', _status: 'draft' }
    await despuesDeCambiar({ context, doc, previousDoc: doc, operation: 'create' })
    expect(leerEstadoPublico).not.toHaveBeenCalled()
    expect(revalidadas()).toEqual([])
  })

  it('publicar invalida el listado, el slug nuevo y el slug que era público', async () => {
    const { revalidadas, leerEstadoPublico } = await actualizar(
      { publicada: true, slug: 'titulo-viejo' },
      { _status: 'published', slug: 'titulo-nuevo' },
    )
    expect(leerEstadoPublico).toHaveBeenCalledWith(REQ, 'publicaciones', 7)
    expect(revalidadas()).toEqual([
      'coleccion:publicaciones',
      'documento:publicaciones:titulo-nuevo',
      'documento:publicaciones:titulo-viejo',
    ])
  })

  it('publicar por primera vez invalida el listado y su slug', async () => {
    const { revalidadas } = await actualizar(
      { publicada: false, slug: 'nueva' },
      {
        _status: 'published',
        slug: 'nueva',
      },
    )
    expect(revalidadas()).toEqual(['coleccion:publicaciones', 'documento:publicaciones:nueva'])
  })

  it('despublicar, aunque la última versión fuera un borrador, invalida lo que era público', async () => {
    const { revalidadas } = await actualizar(
      { publicada: true, slug: 'publica' },
      {
        _status: 'draft',
        slug: 'publica',
      },
    )
    expect(revalidadas()).toEqual(['coleccion:publicaciones', 'documento:publicaciones:publica'])
  })

  it('borrar invalida el listado y el slug del documento borrado', async () => {
    const { hooks, revalidadas } = preparar()
    await hooks.paraColeccion(opciones).despuesDeBorrar({
      context: {},
      doc: { id: 7, slug: 'publica', _status: 'published' },
    })
    expect(revalidadas()).toEqual(['coleccion:publicaciones', 'documento:publicaciones:publica'])
  })

  it('la carga inicial no consulta ni invalida', async () => {
    const { hooks, revalidadas, leerEstadoPublico } = preparar()
    const { antesDeCambiar, despuesDeCambiar } = hooks.paraColeccion(opciones)
    const context = { ...CONTEXTO_SIN_REVALIDACION }
    const doc = { id: 7, slug: 'x', _status: 'published' }
    await antesDeCambiar?.({ context, data: {}, operation: 'update', originalDoc: doc, req: REQ })
    await despuesDeCambiar({ context, doc, previousDoc: doc, operation: 'update' })
    expect(leerEstadoPublico).not.toHaveBeenCalled()
    expect(revalidadas()).toEqual([])
  })
})
