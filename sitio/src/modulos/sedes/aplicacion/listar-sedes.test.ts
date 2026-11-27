import { describe, expect, it } from 'vitest'

import type { SedeGuardada } from '../dominio/sede'
import { crearListarSedes } from './listar-sedes'
import type { RepositorioSedes } from './repositorio-sedes'

const SEDE: SedeGuardada = {
  nombre: 'Sede San Martín de Porres',
  direccion: 'Jr. Iquitos 593',
  distrito: 'San Martín de Porres',
  ciudad: 'Lima',
  celulares: ['951965242'],
  correo: null,
}

describe('crearListarSedes', () => {
  it('prepara cada sede activa que entrega el repositorio, en su orden', async () => {
    const repositorio: RepositorioSedes = { listarActivas: async () => [SEDE, SEDE] }

    const sedes = await crearListarSedes(repositorio)()

    expect(sedes).toHaveLength(2)
    expect(sedes[0]?.celulares).toEqual([{ texto: '951 965 242', href: 'tel:+51951965242' }])
  })

  it('devuelve una lista vacía si no hay sedes', async () => {
    const repositorio: RepositorioSedes = { listarActivas: async () => [] }

    expect(await crearListarSedes(repositorio)()).toEqual([])
  })
})
