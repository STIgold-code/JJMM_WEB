import { describe, expect, it, vi } from 'vitest'

import { CONTEXTO_SIN_REVALIDACION, crearHooksDeRevalidacion } from './hooks-de-revalidacion'

function preparar() {
  const revalidar = vi.fn<(etiqueta: string) => void>()
  const leerEstadoPublico = vi.fn(async () => null)
  const hooks = crearHooksDeRevalidacion<object>({ revalidar, leerEstadoPublico })
  return { hooks, revalidadas: () => revalidar.mock.calls.map(([etiqueta]) => etiqueta) }
}

describe('hooks de revalidación de las globales', () => {
  it('guardar una global invalida su etiqueta', async () => {
    const { hooks, revalidadas } = preparar()
    await hooks.paraGlobal('pagina-de-inicio')({ context: {} })
    expect(revalidadas()).toEqual(['global:pagina-de-inicio'])
  })

  it('no invalida si el contexto lo pide (carga inicial)', async () => {
    const { hooks, revalidadas } = preparar()
    await hooks.paraGlobal('navegacion')({ context: { ...CONTEXTO_SIN_REVALIDACION } })
    expect(revalidadas()).toEqual([])
  })
})
