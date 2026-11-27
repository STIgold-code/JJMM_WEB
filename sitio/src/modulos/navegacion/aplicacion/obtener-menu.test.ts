import { describe, expect, it } from 'vitest'

import type { ItemDeMenuGuardado } from '../dominio/item-de-menu'
import { crearObtenerMenu } from './obtener-menu'
import type { RepositorioNavegacion } from './repositorio-navegacion'

function repositorioCon(items: readonly ItemDeMenuGuardado[]): RepositorioNavegacion {
  return { obtenerItems: async () => items }
}

const item = (etiqueta: string, destino: string | null): ItemDeMenuGuardado => ({
  etiqueta,
  tipo: 'seccion',
  destino,
  abrirEnNuevaPestana: false,
  imagen: null,
})

describe('crearObtenerMenu', () => {
  it('devuelve los ítems resueltos en el orden del panel', async () => {
    const menu = await crearObtenerMenu(
      repositorioCon([item('Servicios', '#servicios'), item('Planes', '#planes')]),
    )()

    expect(menu.map((i) => i.href)).toEqual(['/#servicios', '/#planes'])
  })

  it('omite los ítems con un destino inválido sin perder los demás', async () => {
    const menu = await crearObtenerMenu(
      repositorioCon([item('Roto', null), item('Planes', '#planes')]),
    )()

    expect(menu.map((i) => i.etiqueta)).toEqual(['Planes'])
  })

  it('propaga el error del repositorio en lugar de ocultarlo', async () => {
    const roto: RepositorioNavegacion = {
      obtenerItems: async () => {
        throw new Error('sin conexión')
      },
    }

    await expect(crearObtenerMenu(roto)()).rejects.toThrow('sin conexión')
  })
})
