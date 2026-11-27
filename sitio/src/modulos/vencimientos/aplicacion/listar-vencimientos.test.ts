import { describe, expect, it } from 'vitest'

import type { Vencimiento } from '../dominio/vencimiento'
import { crearListarVencimientos } from './listar-vencimientos'
import type { RepositorioVencimientos } from './repositorio-vencimientos'

const PDT: Vencimiento = {
  obligacion: 'PDT 621 (IGV y Renta)',
  periodicidad: 'mensual',
  cuandoVence: 'Los 07 de cada mes.',
  nota: null,
}
const DAOT: Vencimiento = { ...PDT, obligacion: 'DAOT', periodicidad: 'anual' }

describe('crearListarVencimientos', () => {
  it('agrupa los vencimientos del repositorio por periodicidad', async () => {
    const repositorio: RepositorioVencimientos = { listar: async () => [DAOT, PDT] }

    const grupos = await crearListarVencimientos(repositorio)()

    expect(grupos).toEqual([
      { periodicidad: 'mensual', titulo: 'Mensuales', vencimientos: [PDT] },
      { periodicidad: 'anual', titulo: 'Anuales', vencimientos: [DAOT] },
    ])
  })

  it('devuelve una lista vacía si no hay vencimientos', async () => {
    const repositorio: RepositorioVencimientos = { listar: async () => [] }

    expect(await crearListarVencimientos(repositorio)()).toEqual([])
  })
})
