import { describe, expect, it } from 'vitest'

import { ERROR_DE_FORMULARIO } from './formularios'
import { ERROR_DE_POLIGONO, validarFormularioDeArea } from './validacion-de-area'

const GAJO = '72.8,155.8 174.1,78.7 216.5,191.5'

const FORMULARIO = {
  nombre: ' Sistema de calidad ',
  nombreCorto: 'Calidad',
  descripcion: 'Un sistema de gestión\r\nde calidad.',
  puntos: ['Homologaciones', ' ISO '],
  mensaje: '',
  poligono: ` ${GAJO} `,
}

describe('validarFormularioDeArea', () => {
  it('recorta los textos, deja el mensaje vacío en nulo y conserva el orden de los puntos', () => {
    expect(validarFormularioDeArea(FORMULARIO)).toEqual({
      valido: true,
      datos: {
        nombre: 'Sistema de calidad',
        nombreCorto: 'Calidad',
        descripcion: 'Un sistema de gestión\nde calidad.',
        puntos: ['Homologaciones', 'ISO'],
        mensajeDeConsulta: null,
        poligono: GAJO,
      },
    })
  })

  it('el gajo vacío se guarda vacío: el área queda solo en las pestañas', () => {
    const resultado = validarFormularioDeArea({ ...FORMULARIO, poligono: '  ' })
    expect(resultado.valido && resultado.datos.poligono).toBeNull()
  })

  it('exige nombre, nombre corto y descripción', () => {
    expect(
      validarFormularioDeArea({ ...FORMULARIO, nombre: '', nombreCorto: ' ', descripcion: '' }),
    ).toEqual({
      valido: false,
      errores: {
        nombre: 'Escribe el nombre del área.',
        nombreCorto: 'Escribe el nombre corto de la pestaña.',
        descripcion: 'Escribe la descripción del área.',
      },
    })
  })

  it('un punto vacío se marca en su fila', () => {
    expect(validarFormularioDeArea({ ...FORMULARIO, puntos: ['Uno', ' ', 'Tres'] })).toEqual({
      valido: false,
      errores: { punto: { 1: 'Escribe el punto o quítalo.' } },
    })
  })

  it('rechaza un gajo mal escrito con la regla de la colección', () => {
    expect(validarFormularioDeArea({ ...FORMULARIO, poligono: '1,2 3,4' })).toEqual({
      valido: false,
      errores: { poligono: ERROR_DE_POLIGONO },
    })
  })

  it('rechaza textos desmedidos', () => {
    const largo = 'a'.repeat(201)
    const resultado = validarFormularioDeArea({ ...FORMULARIO, nombre: largo })
    expect(resultado.valido).toBe(false)
    const muchos = validarFormularioDeArea({ ...FORMULARIO, puntos: Array(31).fill('Uno') })
    expect(muchos).toEqual({
      valido: false,
      errores: { puntos: 'Un área puede tener hasta 30 puntos.' },
    })
  })

  it('una forma que no es la del formulario no se adivina', () => {
    for (const hostil of [
      null,
      'texto',
      { ...FORMULARIO, puntos: 'Uno' },
      { ...FORMULARIO, puntos: [1] },
    ]) {
      expect(validarFormularioDeArea(hostil)).toEqual({
        valido: false,
        errores: { general: ERROR_DE_FORMULARIO },
      })
    }
    expect(validarFormularioDeArea({ ...FORMULARIO, codigo: 'P1' }).valido).toBe(true)
  })
})
