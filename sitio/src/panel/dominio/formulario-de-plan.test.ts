import { describe, expect, it } from 'vitest'

import { MENSAJE_SIN_MONTOS } from '@/modulos/planes/dominio/inclusion-de-plan'

import {
  cambiarCelda,
  ERROR_DE_TABLA_CAMBIADA,
  ERROR_NOMBRE_VACIO,
  erroresEnVivo,
  type FormularioDePlan,
  formularioDesdeGuardado,
  hayCambios,
  unirErrores,
} from './formulario-de-plan'
import type { InclusionDelPanel } from './planes'

const PLAN = { id: 3, nombre: 'SIGEMype II', mensajeDeConsulta: null, visible: true, orden: 2 }
const CARACTERISTICAS = [
  { id: 10, nombre: 'Gestión integral de planilla hasta' },
  { id: 11, nombre: 'Libro Bancos mensual' },
  { id: 12, nombre: 'Manejo de Kardex' },
]
const INCLUSIONES: InclusionDelPanel[] = [
  { id: 1, plan: 3, caracteristica: 10, tipo: 'texto', texto: '6 trabajadores' },
  { id: 2, plan: 3, caracteristica: 11, tipo: 'incluido', texto: null },
  { id: 3, plan: 4, caracteristica: 12, tipo: 'incluido', texto: null },
]

const FORMULARIO = formularioDesdeGuardado(PLAN, CARACTERISTICAS, INCLUSIONES)

describe('formularioDesdeGuardado', () => {
  it('arma una celda por característica, en su orden; lo que falta es «No incluido»', () => {
    expect(FORMULARIO).toEqual({
      nombre: 'SIGEMype II',
      mensajeDeConsulta: '',
      visible: true,
      celdas: [
        { caracteristica: 10, tipo: 'texto', texto: '6 trabajadores' },
        { caracteristica: 11, tipo: 'incluido', texto: '' },
        { caracteristica: 12, tipo: 'no-incluido', texto: '' },
      ],
    })
  })
})

describe('hayCambios', () => {
  it('sin tocar nada no hay cambios', () => {
    expect(hayCambios(FORMULARIO, { ...FORMULARIO })).toBe(false)
  })

  it.each<[string, Partial<FormularioDePlan>]>([
    ['el nombre', { nombre: 'SIGEMype III' }],
    ['el mensaje', { mensajeDeConsulta: 'Hola' }],
    ['la visibilidad', { visible: false }],
  ])('detecta un cambio en %s', (_, cambio) => {
    expect(hayCambios(FORMULARIO, { ...FORMULARIO, ...cambio })).toBe(true)
  })

  it('detecta un cambio en una celda', () => {
    expect(hayCambios(FORMULARIO, cambiarCelda(FORMULARIO, 12, { tipo: 'incluido' }))).toBe(true)
  })

  it('volver al valor original deja el formulario sin cambios', () => {
    const ida = cambiarCelda(FORMULARIO, 11, { tipo: 'no-incluido' })
    expect(hayCambios(FORMULARIO, cambiarCelda(ida, 11, { tipo: 'incluido' }))).toBe(false)
  })

  it('espacios al borde y el texto de una celda que no es «Texto» no cuentan como cambio', () => {
    const conEspacios = { ...FORMULARIO, nombre: ' SIGEMype II ' }
    expect(hayCambios(FORMULARIO, conEspacios)).toBe(false)
    expect(hayCambios(FORMULARIO, cambiarCelda(FORMULARIO, 11, { texto: 'basura' }))).toBe(false)
  })
})

describe('erroresEnVivo', () => {
  it('avisa de un monto mientras se escribe, en el nombre o en una celda «Texto»', () => {
    const conMontos = cambiarCelda({ ...FORMULARIO, nombre: 'Plan S/ 99' }, 10, { texto: 'S/ 50' })
    expect(erroresEnVivo(conMontos)).toEqual({
      nombre: MENSAJE_SIN_MONTOS,
      celdas: { 10: MENSAJE_SIN_MONTOS },
    })
  })

  it('no marca nada sin montos, ni el texto oculto de una celda que no es «Texto»', () => {
    expect(erroresEnVivo(FORMULARIO)).toEqual({})
    expect(erroresEnVivo(cambiarCelda(FORMULARIO, 11, { texto: 'S/ 50' }))).toEqual({})
  })

  it('el error del servidor de un campo gana; los demás se suman', () => {
    const enVivo = { nombre: MENSAJE_SIN_MONTOS, celdas: { 10: 'a' } }
    expect(unirErrores(enVivo, { nombre: 'Ya existe', celdas: { 11: 'b' } })).toEqual({
      nombre: 'Ya existe',
      celdas: { 10: 'a', 11: 'b' },
    })
  })
})

describe('mensajes', () => {
  it('los errores están en español neutro', () => {
    expect(ERROR_NOMBRE_VACIO).toBe('Escribe el nombre del plan.')
    expect(ERROR_DE_TABLA_CAMBIADA).toMatch(/Recarga la página/)
    expect(MENSAJE_SIN_MONTOS).toMatch(/Consultar/)
  })
})
