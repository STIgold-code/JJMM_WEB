import { MENSAJE_SIN_MONTOS } from '@/modulos/planes/dominio/inclusion-de-plan'
import { describe, expect, it } from 'vitest'

import { ERROR_DE_FORMULARIO } from './formularios'
import { ERROR_DE_TABLA_CAMBIADA, validarFilas } from './validacion-de-filas'

const GUARDADAS = [10, 11, 12]
const CONOCIDAS = [10, 11, 12]
const TABLA_CAMBIADA = {
  valido: false,
  errores: { general: ERROR_DE_TABLA_CAMBIADA, tablaCambiada: true },
}

const enviar = (filas: unknown, conocidas: unknown = CONOCIDAS) => ({ conocidas, filas })

describe('validarFilas', () => {
  it('recorta los nombres y conserva el orden; una fila nueva llega con id nulo', () => {
    expect(
      validarFilas(
        enviar([
          { id: '12', nombre: ' Manejo de Kardex ' },
          { id: null, nombre: 'Libro Bancos mensual' },
        ]),
        GUARDADAS,
      ),
    ).toEqual({
      valido: true,
      datos: [
        { id: 12, nombre: 'Manejo de Kardex' },
        { id: null, nombre: 'Libro Bancos mensual' },
      ],
    })
  })

  it('cada error va a la posición de su fila: vacía, con montos o repetida', () => {
    expect(
      validarFilas(
        enviar([
          { id: 10, nombre: ' ' },
          { id: 11, nombre: 'Hasta S/ 500' },
          { id: 12, nombre: 'Kárdex' },
          { id: null, nombre: 'kardex' },
        ]),
        GUARDADAS,
      ),
    ).toEqual({
      valido: false,
      errores: {
        fila: {
          0: 'Escribe el nombre de la fila o quítala.',
          1: MENSAJE_SIN_MONTOS,
          3: 'Ya hay una fila con ese nombre (posición 3).',
        },
      },
    })
  })

  it('una fila guardada que el navegador no conocía: la tabla cambió y nada se borra', () => {
    // Alguien agregó la fila 13 después de que se abrió la pantalla; quien guarda no la conocía.
    expect(validarFilas(enviar([{ id: 10, nombre: 'Una' }]), [...GUARDADAS, 13])).toEqual(
      TABLA_CAMBIADA,
    )
  })

  it('un id que no está guardado, que no se conocía o repetido: la tabla cambió', () => {
    for (const entrada of [
      enviar([{ id: 99, nombre: 'Otra' }], [...CONOCIDAS, 99]),
      enviar([{ id: 10, nombre: 'Una' }], [11, 12]),
      enviar([
        { id: 10, nombre: 'Una' },
        { id: 10, nombre: 'Otra' },
      ]),
    ])
      expect(validarFilas(entrada, GUARDADAS)).toEqual(TABLA_CAMBIADA)
  })

  it('una fila conocida que alguien ya borró no cambia nada si también se quita', () => {
    // El navegador conocía la 12, que ya no existe, y la quitó: no amplía lo que se borra.
    const resultado = validarFilas(enviar([{ id: 10, nombre: 'Una' }]), [10, 11])
    expect(resultado).toEqual({ valido: true, datos: [{ id: 10, nombre: 'Una' }] })
  })

  it('una forma que no es la del formulario no se adivina', () => {
    const muchas = Array.from({ length: 101 }, (_, i) => i + 1)
    for (const hostil of [
      null,
      [{ id: 10, nombre: 'x' }],
      enviar([{ id: '1 OR 1=1', nombre: 'x' }]),
      enviar([{ id: 10 }]),
      enviar([], 'todas'),
      enviar([], [10, '11;DROP']),
      enviar([], [10, 10]),
      enviar([], muchas),
    ])
      expect(validarFilas(hostil, GUARDADAS)).toEqual({
        valido: false,
        errores: { general: ERROR_DE_FORMULARIO },
      })
  })

  it('pone un tope a la cantidad de filas', () => {
    const muchas = Array.from({ length: 101 }, (_, i) => ({ id: null, nombre: `Fila ${i}` }))
    expect(validarFilas(enviar(muchas), GUARDADAS)).toEqual({
      valido: false,
      errores: { general: 'La tabla puede tener hasta 100 filas.' },
    })
  })
})
