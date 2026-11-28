import { describe, expect, it } from 'vitest'

import { ERROR_DE_FORMULARIO } from './formularios'
import { validarFormularioDeCronograma } from './validacion-de-cronograma'

const FECHAS = [
  '2026-02-13',
  '2026-02-16',
  '2026-02-17',
  '2026-02-18',
  '2026-02-19',
  '2026-02-20',
  '2026-02-23',
  '2026-02-24',
  '2026-02-25',
  '2026-02-12',
]

const FORMULARIO = { anio: '2026', mes: '1', fechas: FECHAS, buenosContribuyentes: '' }

describe('validarFormularioDeCronograma', () => {
  it('devuelve el periodo y una fecha por cada dígito del RUC, del 0 al 9', () => {
    const resultado = validarFormularioDeCronograma(FORMULARIO)
    expect(resultado).toEqual({
      valido: true,
      datos: {
        anio: 2026,
        mes: 1,
        fechas: FECHAS.map((fecha, digito) => ({ digito, fecha })),
        buenosContribuyentes: null,
      },
    })
  })

  it('acepta la fecha de buenos contribuyentes y el año y el mes como números', () => {
    const resultado = validarFormularioDeCronograma({
      ...FORMULARIO,
      anio: 2027,
      mes: 12,
      buenosContribuyentes: '2028-01-26',
    })
    expect(resultado).toMatchObject({
      valido: true,
      datos: { anio: 2027, mes: 12, buenosContribuyentes: '2028-01-26' },
    })
  })

  it('cada fecha que falta o no existe va a su dígito', () => {
    const fechas = [...FECHAS]
    fechas[3] = ''
    fechas[7] = '2026-02-30'
    expect(validarFormularioDeCronograma({ ...FORMULARIO, fechas })).toEqual({
      valido: false,
      errores: {
        fechas: {
          3: 'Escribe la fecha del dígito 3.',
          7: 'Esa fecha no existe. Revísala.',
        },
      },
    })
  })

  it('el año va de 2020 a 2100 y el mes de 1 a 12', () => {
    expect(
      validarFormularioDeCronograma({
        ...FORMULARIO,
        anio: '2019',
        mes: '13',
        buenosContribuyentes: 'mañana',
      }),
    ).toEqual({
      valido: false,
      errores: {
        anio: 'Escribe un año entre 2020 y 2100.',
        mes: 'Elige el mes del periodo.',
        buenosContribuyentes: 'Esa fecha no existe. Revísala.',
      },
    })
    for (const anio of ['2026.5', '2026e0', ' ', 'dos mil'])
      expect(validarFormularioDeCronograma({ ...FORMULARIO, anio }).valido).toBe(false)
  })

  it('sin exactamente diez fechas o con otra forma, es un error general', () => {
    for (const entrada of [
      { ...FORMULARIO, fechas: FECHAS.slice(0, 9) },
      { ...FORMULARIO, fechas: [...FECHAS, '2026-02-26'] },
      { ...FORMULARIO, fechas: 'texto' },
      { ...FORMULARIO, buenosContribuyentes: null },
      null,
    ])
      expect(validarFormularioDeCronograma(entrada)).toEqual({
        valido: false,
        errores: { general: ERROR_DE_FORMULARIO },
      })
  })
})
