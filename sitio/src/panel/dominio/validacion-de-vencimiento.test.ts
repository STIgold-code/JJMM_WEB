import { describe, expect, it } from 'vitest'

import { ERROR_DE_FORMULARIO } from './formularios'
import { validarFormularioDeVencimiento } from './validacion-de-vencimiento'

const FORMULARIO = {
  obligacion: ' PLAME ',
  periodicidad: 'mensual',
  cuandoVence: ' Los 01 de cada mes. ',
  nota: '  ',
}

describe('validarFormularioDeVencimiento', () => {
  it('limpia los textos; una nota vacía no se guarda', () => {
    expect(validarFormularioDeVencimiento(FORMULARIO)).toEqual({
      valido: true,
      datos: {
        obligacion: 'PLAME',
        periodicidad: 'mensual',
        cuandoVence: 'Los 01 de cada mes.',
        nota: null,
      },
    })
  })

  it('exige la obligación y cuándo vence', () => {
    expect(
      validarFormularioDeVencimiento({ ...FORMULARIO, obligacion: '', cuandoVence: ' ' }),
    ).toEqual({
      valido: false,
      errores: {
        obligacion: 'Escribe la obligación.',
        cuandoVence:
          'Escribe cuándo vence. Si no hay fecha, escribe «Consulta la fecha con el estudio.»',
      },
    })
  })

  it('pone topes a los textos', () => {
    const resultado = validarFormularioDeVencimiento({
      ...FORMULARIO,
      obligacion: 'x'.repeat(201),
      nota: 'x'.repeat(1001),
    })
    expect(resultado).toEqual({
      valido: false,
      errores: {
        obligacion: 'Es demasiado largo: usa hasta 200 caracteres.',
        nota: 'Es demasiado largo: usa hasta 1000 caracteres.',
      },
    })
  })

  it('una periodicidad que no existe o una forma distinta es un error general', () => {
    for (const entrada of [
      { ...FORMULARIO, periodicidad: 'semanal' },
      { ...FORMULARIO, nota: undefined },
      null,
    ])
      expect(validarFormularioDeVencimiento(entrada)).toEqual({
        valido: false,
        errores: { general: ERROR_DE_FORMULARIO },
      })
  })
})
