import { describe, expect, it } from 'vitest'

import { ERROR_DE_FORMULARIO } from './formularios'
import {
  formularioDeValor,
  hayCambiosEnElValor,
  nombreDelIcono,
  RUTA_DE_VALORES,
  secundarioDeValor,
  validarFormularioDeValor,
} from './valores'

const VALOR = { id: 2, nombre: 'Compromiso', icono: 'trofeo', orden: 1 } as const

describe('valores', () => {
  it('se editan dentro de «Página de inicio»', () => {
    expect(RUTA_DE_VALORES).toBe('/panel/pagina-de-inicio/valores')
  })

  it('nombra el ícono como la colección', () => {
    expect(nombreDelIcono('pulgar')).toBe('Pulgar arriba')
    expect(secundarioDeValor(VALOR)).toBe('Ícono: Trofeo')
  })

  it('el formulario parte de lo guardado o vacío para uno nuevo', () => {
    expect(formularioDeValor(VALOR)).toEqual({ nombre: 'Compromiso', icono: 'trofeo' })
    expect(formularioDeValor(null)).toEqual({ nombre: '', icono: '' })
    const original = formularioDeValor(VALOR)
    expect(hayCambiosEnElValor(original, { ...original, nombre: 'Compromiso ' })).toBe(false)
    expect(hayCambiosEnElValor(original, { ...original, icono: 'foco' })).toBe(true)
  })
})

describe('validarFormularioDeValor', () => {
  it('recorta el nombre y acepta solo un ícono de la lista cerrada', () => {
    expect(validarFormularioDeValor({ nombre: ' Excelencia ', icono: 'pulgar' })).toEqual({
      valido: true,
      datos: { nombre: 'Excelencia', icono: 'pulgar' },
    })
    expect(validarFormularioDeValor({ nombre: '', icono: 'cohete' })).toEqual({
      valido: false,
      errores: { nombre: 'Escribe el nombre del valor.', icono: 'Elige un ícono.' },
    })
    expect(validarFormularioDeValor({ nombre: 'a'.repeat(101), icono: 'foco' }).valido).toBe(false)
  })

  it('una forma que no es la del formulario no se adivina', () => {
    for (const hostil of [null, [], { nombre: 1, icono: 'foco' }])
      expect(validarFormularioDeValor(hostil)).toEqual({
        valido: false,
        errores: { general: ERROR_DE_FORMULARIO },
      })
  })
})
