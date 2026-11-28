import { describe, expect, it } from 'vitest'

import {
  type AreaDelPanel,
  estaEnLaRueda,
  razonSinNuevaArea,
  rutaDelArea,
  secundarioDeArea,
} from './areas-de-servicio'
import {
  agregarPunto,
  erroresEnVivoDeArea,
  formularioDeArea,
  hayCambiosEnElArea,
  moverPunto,
  quitarPunto,
} from './formulario-de-area'

const GAJO = '72.8,155.8 174.1,78.7 216.5,191.5'

const AREA: AreaDelPanel = {
  id: 3,
  codigo: 'P6',
  nombre: 'Sistema de calidad',
  nombreCorto: 'Calidad',
  descripcion: 'Un sistema de gestión de calidad.',
  puntos: ['Sistema de calidad SIGE Mype', 'Homologaciones'],
  mensajeDeConsulta: 'Hola, quiero información del servicio de Sistema de calidad.',
  poligono: GAJO,
  orden: 5,
}

describe('áreas de servicio', () => {
  it('cada área se edita en su página', () => {
    expect(rutaDelArea(3)).toBe('/panel/areas/3')
  })

  it('el dato secundario dice su pestaña y cuántos puntos tiene', () => {
    expect(secundarioDeArea(AREA)).toBe('Pestaña «Calidad» · 2 puntos en «Qué incluye»')
    expect(secundarioDeArea({ ...AREA, puntos: ['Uno'] })).toBe(
      'Pestaña «Calidad» · 1 punto en «Qué incluye»',
    )
  })

  it('está en la rueda solo con un gajo válido', () => {
    expect(estaEnLaRueda(GAJO)).toBe(true)
    expect(estaEnLaRueda(null)).toBe(false)
    expect(estaEnLaRueda('1,2 3,4')).toBe(false)
  })

  it('explica por qué no se crea otra área', () => {
    expect(razonSinNuevaArea(9)).toBe(
      '9 áreas: ya están todas las de la rueda (P1 a P9), por eso no se puede crear otra.',
    )
    expect(razonSinNuevaArea(8)).toContain('no se crean desde el panel')
  })
})

describe('formulario de un área', () => {
  it('parte de lo guardado, con una clave por punto', () => {
    const formulario = formularioDeArea(AREA)
    expect(formulario).toMatchObject({ nombre: 'Sistema de calidad', poligono: GAJO })
    expect(formulario.puntos).toEqual([
      { clave: 1, texto: 'Sistema de calidad SIGE Mype' },
      { clave: 2, texto: 'Homologaciones' },
    ])
    expect(formularioDeArea({ ...AREA, mensajeDeConsulta: null, poligono: null })).toMatchObject({
      mensaje: '',
      poligono: '',
    })
  })

  it('agrega un punto vacío al final, lo mueve y lo quita', () => {
    const conNuevo = agregarPunto(formularioDeArea(AREA))
    expect(conNuevo.puntos.at(-1)).toEqual({ clave: 3, texto: '' })
    expect(moverPunto(conNuevo, 2, 0).puntos.map((p) => p.clave)).toEqual([3, 1, 2])
    expect(quitarPunto(conNuevo, 1).puntos.map((p) => p.clave)).toEqual([2, 3])
  })

  it('solo hay cambios si cambia lo que se guardaría', () => {
    const original = formularioDeArea(AREA)
    expect(hayCambiosEnElArea(original, { ...original, nombre: ' Sistema de calidad ' })).toBe(
      false,
    )
    expect(hayCambiosEnElArea(original, { ...original, nombre: 'Calidad' })).toBe(true)
    expect(hayCambiosEnElArea(original, moverPunto(original, 1, 0))).toBe(true)
    expect(hayCambiosEnElArea(original, agregarPunto(original))).toBe(true)
  })

  it('marca un gajo mal escrito mientras se escribe; vacío no es un error', () => {
    const original = formularioDeArea(AREA)
    expect(erroresEnVivoDeArea({ ...original, poligono: '1,2 3' }).poligono).toBeDefined()
    expect(erroresEnVivoDeArea({ ...original, poligono: '' })).toEqual({})
    expect(erroresEnVivoDeArea(original)).toEqual({})
  })
})
