import { MENSAJE_SIN_MONTOS } from '@/modulos/planes/dominio/inclusion-de-plan'
import { describe, expect, it } from 'vitest'

import {
  agregarFilaNueva,
  celdasDeLaFila,
  conocidasDe,
  filasParaGuardar,
  erroresEnVivoDeFilas,
  formularioDeFilas,
  hayCambiosEnLasFilas,
  resumenDeFila,
  vistaPreviaDeFilas,
} from './filas-de-la-tabla'
import type { InclusionDelPanel, PlanDelPanel } from './planes'

const plan = (id: number, nombre: string, visible = true): PlanDelPanel => ({
  id,
  nombre,
  mensajeDeConsulta: null,
  visible,
  orden: id,
})
const PLANES = [plan(1, 'Emprende'), plan(2, 'SIGEMype I'), plan(3, 'Oculto', false)]
const celda = (
  id: number,
  planId: number,
  caracteristica: number,
  tipo: InclusionDelPanel['tipo'],
  texto: string | null = null,
): InclusionDelPanel => ({ id, plan: planId, caracteristica, tipo, texto })
const INCLUSIONES = [
  celda(1, 1, 10, 'incluido'),
  celda(2, 2, 10, 'incluido'),
  celda(3, 3, 10, 'incluido'),
  celda(4, 1, 11, 'texto', 'Consultar'),
  celda(5, 2, 11, 'no-incluido'),
]
const GUARDADAS = [
  { id: 10, nombre: 'Libros electrónicos' },
  { id: 11, nombre: 'Para empresas con ventas anuales hasta de' },
  { id: 12, nombre: 'Manejo de Kardex' },
]

describe('formulario de las filas', () => {
  it('parte de las filas guardadas, en orden, y agrega filas nuevas al final', () => {
    const filas = formularioDeFilas(GUARDADAS)
    expect(filas.map((f) => [f.clave, f.id])).toEqual([
      [1, 10],
      [2, 11],
      [3, 12],
    ])
    expect(agregarFilaNueva(filas).at(-1)).toEqual({ clave: 4, id: null, nombre: '' })
  })

  it('al guardar manda las filas y los ids que se cargaron (las que conoce el navegador)', () => {
    const filas = agregarFilaNueva(formularioDeFilas(GUARDADAS)).slice(1)
    expect(filasParaGuardar(conocidasDe(GUARDADAS), filas)).toEqual({
      conocidas: [10, 11, 12],
      filas: [
        { id: 11, nombre: 'Para empresas con ventas anuales hasta de' },
        { id: 12, nombre: 'Manejo de Kardex' },
        { id: null, nombre: '' },
      ],
    })
  })

  it('solo hay cambios si cambia un nombre, el orden o la lista', () => {
    const filas = formularioDeFilas(GUARDADAS)
    const renombradas = filas.map((f) =>
      f.id === 10 ? { ...f, nombre: ' Libros electrónicos ' } : f,
    )
    expect(hayCambiosEnLasFilas(filas, renombradas)).toBe(false)
    expect(hayCambiosEnLasFilas(filas, [...filas].reverse())).toBe(true)
    expect(hayCambiosEnLasFilas(filas, filas.slice(1))).toBe(true)
    expect(hayCambiosEnLasFilas(filas, agregarFilaNueva(filas))).toBe(true)
  })

  it('marca montos y nombres repetidos mientras se escribe, por la clave de la fila', () => {
    const filas = [
      ...formularioDeFilas(GUARDADAS),
      { clave: 9, id: null, nombre: 'manejo de kárdex' },
      { clave: 8, id: null, nombre: 'Desde S/ 100' },
    ]
    expect(erroresEnVivoDeFilas(filas)).toEqual({
      9: 'Ya hay una fila con ese nombre (posición 3).',
      8: MENSAJE_SIN_MONTOS,
    })
  })
})

describe('resumen y celdas de una fila', () => {
  it('dice en cuántos planes está incluida, o si tiene texto', () => {
    expect(resumenDeFila(10, PLANES, INCLUSIONES)).toBe('Incluida en los 3 planes')
    expect(resumenDeFila(11, PLANES, INCLUSIONES)).toBe('Con texto en 1 de 3 planes')
    expect(resumenDeFila(12, PLANES, INCLUSIONES)).toBe('No incluida en ningún plan')
    expect(resumenDeFila(null, PLANES, INCLUSIONES)).toBe(
      'Nueva: en los 3 planes empieza como «No incluido». Márcala en cada plan.',
    )
  })

  it('lista lo que tiene cada plan en esa fila (una celda que falta es «No incluido»)', () => {
    expect(celdasDeLaFila(11, PLANES, INCLUSIONES)).toBe(
      'Emprende: «Consultar» · SIGEMype I: No incluido · Oculto: No incluido',
    )
  })
})

describe('vistaPreviaDeFilas', () => {
  it('la tabla del sitio con las filas del formulario: solo planes visibles y filas nuevas vacías', () => {
    const vista = vistaPreviaDeFilas(PLANES, INCLUSIONES, [
      { clave: 1, id: 11, nombre: 'Ventas' },
      { clave: 2, id: null, nombre: '' },
    ])
    expect(vista.columnas.map((c) => c.nombre)).toEqual(['Emprende', 'SIGEMype I'])
    expect(vista.filas).toEqual([
      {
        caracteristica: 'Ventas',
        celdas: [{ tipo: 'texto', texto: 'Consultar' }, { tipo: 'no-incluido' }],
      },
      { caracteristica: '…', celdas: [{ tipo: 'no-incluido' }, { tipo: 'no-incluido' }] },
    ])
  })
})
