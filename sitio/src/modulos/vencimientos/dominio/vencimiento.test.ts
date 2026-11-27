import { describe, expect, it } from 'vitest'

import { agruparPorPeriodicidad, type Vencimiento } from './vencimiento'

const vencimiento = (obligacion: string, periodicidad: Vencimiento['periodicidad']) => ({
  obligacion,
  periodicidad,
  cuandoVence: 'Los 07 de cada mes.',
  nota: null,
})

describe('agruparPorPeriodicidad', () => {
  it('pone primero los mensuales y luego los anuales, sin cambiar el orden del panel', () => {
    const grupos = agruparPorPeriodicidad([
      vencimiento('DAOT', 'anual'),
      vencimiento('PDT 621', 'mensual'),
      vencimiento('ITAN', 'anual'),
      vencimiento('PLAME', 'mensual'),
    ])

    expect(grupos.map((grupo) => grupo.periodicidad)).toEqual(['mensual', 'anual'])
    expect(grupos[0]?.vencimientos.map((v) => v.obligacion)).toEqual(['PDT 621', 'PLAME'])
    expect(grupos[1]?.vencimientos.map((v) => v.obligacion)).toEqual(['DAOT', 'ITAN'])
  })

  it('nombra cada grupo por su periodicidad', () => {
    const grupos = agruparPorPeriodicidad([
      vencimiento('PDT 621', 'mensual'),
      vencimiento('DAOT', 'anual'),
    ])

    expect(grupos.map((grupo) => grupo.titulo)).toEqual(['Mensuales', 'Anuales'])
  })

  it('omite la periodicidad que no tiene vencimientos', () => {
    const grupos = agruparPorPeriodicidad([vencimiento('DAOT', 'anual')])

    expect(grupos.map((grupo) => grupo.periodicidad)).toEqual(['anual'])
  })

  it('devuelve una lista vacía si no hay vencimientos', () => {
    expect(agruparPorPeriodicidad([])).toEqual([])
  })
})
