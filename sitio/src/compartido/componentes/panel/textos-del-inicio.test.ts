import { describe, expect, it } from 'vitest'

import { cantidadConNombre, fechaLarga, primeraOracion } from './textos-del-inicio'

describe('fechaLarga', () => {
  it('escribe la fecha de Lima con el día de la semana, con mayúscula inicial', () => {
    expect(fechaLarga(new Date('2026-11-27T15:00:00Z'))).toBe('Viernes, 27 de noviembre de 2026')
  })

  it('usa la hora de Lima, no la del servidor', () => {
    // 02:00 UTC del 28 son las 21:00 del 27 en Lima.
    expect(fechaLarga(new Date('2026-11-28T02:00:00Z'))).toBe('Viernes, 27 de noviembre de 2026')
  })
})

describe('primeraOracion', () => {
  it('se queda con la primera oración de la descripción', () => {
    expect(
      primeraOracion('Artículos del blog (/blog). «Guardar borrador» guarda tu trabajo.'),
    ).toBe('Artículos del blog (/blog).')
  })

  it('no corta dentro de las comillas latinas', () => {
    expect(primeraOracion('Pulsa «Ver. Más» para abrirlo. Luego guarda.')).toBe(
      'Pulsa «Ver. Más» para abrirlo.',
    )
  })

  it('devuelve el texto entero si es una sola oración', () => {
    expect(primeraOracion('Oficinas del estudio.')).toBe('Oficinas del estudio.')
    expect(primeraOracion('  ')).toBe('')
  })
})

describe('cantidadConNombre', () => {
  it('usa el singular solo para uno', () => {
    expect(cantidadConNombre(1, 'sede activa', 'sedes activas')).toBe('sede activa')
    expect(cantidadConNombre(0, 'sede activa', 'sedes activas')).toBe('sedes activas')
    expect(cantidadConNombre(3, 'sede activa', 'sedes activas')).toBe('sedes activas')
  })
})
