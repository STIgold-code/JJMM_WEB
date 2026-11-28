import { describe, expect, it } from 'vitest'

import {
  avisoDeSedeCreada,
  avisoDeSedeEliminada,
  avisoDeSedeGuardada,
  avisoDeVisibilidadDeSede,
  esLaUltimaVisible,
  nombreCorto,
  puedeEliminarSedes,
  rutaDeLaSede,
  secundarioDeSede,
} from './sedes'

describe('rutas de sedes', () => {
  it('la edición de una sede cuelga de /panel/sedes', () => {
    expect(rutaDeLaSede(3)).toBe('/panel/sedes/3')
  })
})

describe('nombreCorto', () => {
  it('quita el «Sede» del principio para no repetirlo en los avisos', () => {
    expect(nombreCorto('Sede San Isidro')).toBe('San Isidro')
    expect(nombreCorto('  sede   Lima Norte ')).toBe('Lima Norte')
    expect(nombreCorto('Oficina central')).toBe('Oficina central')
  })
})

describe('secundarioDeSede', () => {
  const SEDE = { direccion: 'Jr. Iquitos 593', distrito: 'San Martín de Porres', ciudad: 'Lima' }

  it('muestra la dirección completa de la sede', () => {
    expect(secundarioDeSede({ ...SEDE, mapa: 'https://www.google.com/maps/embed?pb=1' })).toBe(
      'Jr. Iquitos 593, San Martín de Porres, Lima',
    )
  })

  it('avisa cuando la sede no tiene mapa insertado', () => {
    expect(secundarioDeSede({ ...SEDE, mapa: null })).toBe(
      'Jr. Iquitos 593, San Martín de Porres, Lima · sin mapa insertado',
    )
  })
})

describe('esLaUltimaVisible', () => {
  const SEDES = [
    { id: 1, visible: true },
    { id: 2, visible: false },
  ]

  it('es la última visible si está visible y ninguna otra lo está', () => {
    expect(esLaUltimaVisible(SEDES, 1)).toBe(true)
  })

  it('no lo es si está oculta o si hay otra visible', () => {
    expect(esLaUltimaVisible(SEDES, 2)).toBe(false)
    expect(esLaUltimaVisible([...SEDES, { id: 3, visible: true }], 1)).toBe(false)
  })
})

describe('puedeEliminarSedes', () => {
  it('solo el administrador elimina sedes', () => {
    expect(puedeEliminarSedes('administrador')).toBe(true)
    expect(puedeEliminarSedes('editor')).toBe(false)
  })
})

describe('avisos de sedes', () => {
  it('nombra la sede sin repetir «Sede», con el texto de la maqueta', () => {
    expect(avisoDeVisibilidadDeSede('Sede San Isidro', true).titulo).toBe(
      'La sede San Isidro ya se ve en el sitio',
    )
    expect(avisoDeVisibilidadDeSede('Sede San Isidro', false).titulo).toBe(
      'La sede San Isidro quedó oculta en el sitio',
    )
  })

  it('al guardar, el detalle dice dónde se ve, o que la sede está oculta', () => {
    expect(avisoDeSedeGuardada(true)).toEqual({
      titulo: 'Cambios guardados',
      detalle: 'El pie y «Contáctanos» ya muestran los cambios.',
    })
    expect(avisoDeSedeGuardada(false).detalle).toBe(
      'La sede está oculta: no se muestra en el sitio.',
    )
  })

  it('al crear y al eliminar nombra la sede', () => {
    expect(avisoDeSedeCreada('Sede Lima Norte', false).titulo).toBe('Sede Lima Norte creada')
    expect(avisoDeSedeEliminada('Sede Lima Norte')).toEqual({
      titulo: 'Sede eliminada',
      detalle: 'Se borró Sede Lima Norte.',
    })
  })
})
