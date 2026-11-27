import { beforeEach, describe, expect, it, vi } from 'vitest'

const { revalidateTag } = vi.hoisted(() => ({ revalidateTag: vi.fn() }))

vi.mock('next/cache', () => ({ revalidateTag, unstable_cache: vi.fn() }))

import { COLECCIONES, COLECCIONES_SIN_REVALIDACION, GLOBALES } from './contenido'

// Los hooks de Payload esperan todos sus argumentos; la prueba pasa solo los que usan los
// hooks de revalidación, por eso se llaman con una firma más amplia.
type HookDePrueba = (argumentos: Record<string, unknown>) => unknown

async function ejecutar(
  hooks: readonly unknown[] | undefined,
  argumentos: Record<string, unknown>,
) {
  for (const hook of hooks ?? []) await (hook as HookDePrueba)(argumentos)
}

const DOCUMENTO = { id: 1, slug: 'documento', _status: 'published' }
const CAMBIO = { context: {}, doc: DOCUMENTO, previousDoc: DOCUMENTO, operation: 'create', req: {} }
const SIN_REVALIDACION = new Set<string>(COLECCIONES_SIN_REVALIDACION)
const PUBLICAS = COLECCIONES.filter(({ slug }) => !SIN_REVALIDACION.has(slug))
const PRIVADAS = COLECCIONES.filter(({ slug }) => SIN_REVALIDACION.has(slug))

const etiquetasRevalidadas = () => revalidateTag.mock.calls.map(([etiqueta]) => etiqueta)

beforeEach(() => {
  revalidateTag.mockClear()
})

describe('revalidación conectada en contenido.ts', () => {
  it('solo quedan fuera las colecciones que el sitio público nunca lee', () => {
    expect([...COLECCIONES_SIN_REVALIDACION].sort()).toEqual(['mensajes-de-contacto', 'usuarios'])
    expect(PRIVADAS).toHaveLength(COLECCIONES_SIN_REVALIDACION.length)
  })

  it.each(PUBLICAS.map((coleccion) => [coleccion.slug, coleccion] as const))(
    'la colección %s invalida su etiqueta al cambiar y al borrar, de inmediato',
    async (slug, coleccion) => {
      await ejecutar(coleccion.hooks?.afterChange, CAMBIO)
      expect(etiquetasRevalidadas()).toContain(`coleccion:${slug}`)
      expect(revalidateTag).toHaveBeenCalledWith(`coleccion:${slug}`, { expire: 0 })

      revalidateTag.mockClear()
      await ejecutar(coleccion.hooks?.afterDelete, { context: {}, doc: DOCUMENTO, req: {} })
      expect(etiquetasRevalidadas()).toContain(`coleccion:${slug}`)
    },
  )

  it.each(PRIVADAS.map((coleccion) => [coleccion.slug, coleccion] as const))(
    'la colección %s no invalida nada',
    async (_slug, coleccion) => {
      await ejecutar(coleccion.hooks?.afterChange, CAMBIO)
      await ejecutar(coleccion.hooks?.afterDelete, { context: {}, doc: DOCUMENTO, req: {} })
      expect(revalidateTag).not.toHaveBeenCalled()
    },
  )

  it('las colecciones con borradores leen el estado público antes de cambiar', () => {
    const conBorradores = COLECCIONES.filter(
      ({ versions }) => typeof versions === 'object' && Boolean(versions.drafts),
    )
    expect(conBorradores.map(({ slug }) => slug)).toEqual(['publicaciones'])
    for (const coleccion of conBorradores) {
      expect(coleccion.hooks?.beforeChange?.length ?? 0).toBeGreaterThan(0)
    }
  })

  it.each(GLOBALES.map((global) => [global.slug, global] as const))(
    'la global %s invalida su etiqueta al guardarse',
    async (slug, global) => {
      await ejecutar(global.hooks?.afterChange, { context: {}, doc: {}, previousDoc: {}, req: {} })
      expect(revalidateTag).toHaveBeenCalledWith(`global:${slug}`, { expire: 0 })
    },
  )
})
