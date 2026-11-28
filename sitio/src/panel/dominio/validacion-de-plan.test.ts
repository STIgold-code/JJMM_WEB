import { describe, expect, it } from 'vitest'

import { MENSAJE_SIN_MONTOS } from '@/modulos/planes/dominio/inclusion-de-plan'

import { ERROR_DE_TABLA_CAMBIADA, ERROR_NOMBRE_VACIO } from './formulario-de-plan'
import {
  ERROR_DE_FORMULARIO,
  validarFormularioDePlan,
  validarNombreDePlan,
} from './validacion-de-plan'

const CARACTERISTICAS = [10, 11]

const entrada = (cambios: Record<string, unknown> = {}) => ({
  nombre: ' SIGEMype II ',
  mensajeDeConsulta: ' Hola, quiero información. ',
  visible: true,
  celdas: [
    { caracteristica: 10, tipo: 'texto', texto: ' 6 trabajadores ' },
    { caracteristica: 11, tipo: 'incluido', texto: 'resto de un texto anterior' },
  ],
  ...cambios,
})

describe('validarNombreDePlan', () => {
  it('recorta el nombre y exige que no esté vacío ni tenga montos', () => {
    expect(validarNombreDePlan('  Emprende ')).toEqual({ nombre: 'Emprende' })
    expect(validarNombreDePlan('   ')).toEqual({ error: ERROR_NOMBRE_VACIO })
    expect(validarNombreDePlan(undefined)).toEqual({ error: ERROR_NOMBRE_VACIO })
    expect(validarNombreDePlan('Plan S/ 350')).toEqual({ error: MENSAJE_SIN_MONTOS })
  })
})

describe('validarFormularioDePlan', () => {
  it('normaliza: recorta textos, vacía el mensaje en blanco y descarta el texto de lo que no es «Texto»', () => {
    expect(validarFormularioDePlan(entrada(), CARACTERISTICAS)).toEqual({
      valido: true,
      datos: {
        nombre: 'SIGEMype II',
        mensajeDeConsulta: 'Hola, quiero información.',
        visible: true,
        celdas: [
          { caracteristica: 10, tipo: 'texto', texto: '6 trabajadores' },
          { caracteristica: 11, tipo: 'incluido', texto: null },
        ],
      },
    })
    const sinMensaje = validarFormularioDePlan(
      entrada({ mensajeDeConsulta: '  ' }),
      CARACTERISTICAS,
    )
    expect(sinMensaje.valido && sinMensaje.datos.mensajeDeConsulta).toBeNull()
  })

  it('devuelve el error de cada celda y del nombre a la vez', () => {
    const celdas = [
      { caracteristica: 10, tipo: 'texto', texto: 'S/ 120 al mes' },
      { caracteristica: 11, tipo: 'texto', texto: '  ' },
    ]
    const resultado = validarFormularioDePlan(entrada({ nombre: '', celdas }), CARACTERISTICAS)
    expect(resultado).toEqual({
      valido: false,
      errores: {
        nombre: ERROR_NOMBRE_VACIO,
        celdas: {
          10: MENSAJE_SIN_MONTOS,
          11: 'Escribe el texto que se muestra en la celda, por ejemplo «Consultar».',
        },
      },
    })
  })

  it.each([
    ['falta una característica', [{ caracteristica: 10, tipo: 'incluido', texto: '' }]],
    [
      'llega una característica que no existe',
      [
        { caracteristica: 10, tipo: 'incluido', texto: '' },
        { caracteristica: 99, tipo: 'incluido', texto: '' },
      ],
    ],
    [
      'una característica se repite',
      [
        { caracteristica: 10, tipo: 'incluido', texto: '' },
        { caracteristica: 10, tipo: 'incluido', texto: '' },
      ],
    ],
  ])('si %s, pide recargar sin guardar nada', (_, celdas) => {
    expect(validarFormularioDePlan(entrada({ celdas }), CARACTERISTICAS)).toEqual({
      valido: false,
      errores: { general: ERROR_DE_TABLA_CAMBIADA },
    })
  })

  it.each([
    ['no es un objeto', 'nombre=SIGEMype'],
    ['la visibilidad no es un sí o un no', entrada({ visible: 'true' })],
    ['un tipo de celda no existe', entrada({ celdas: [{ caracteristica: 10, tipo: 'quizas' }] })],
    ['las celdas no son una lista', entrada({ celdas: {} })],
    ['el mensaje no es texto', entrada({ mensajeDeConsulta: 5 })],
  ])('rechaza el formulario si %s', (_, valor) => {
    expect(validarFormularioDePlan(valor, CARACTERISTICAS)).toEqual({
      valido: false,
      errores: { general: ERROR_DE_FORMULARIO },
    })
  })
})
