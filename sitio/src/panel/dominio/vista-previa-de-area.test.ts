import { describe, expect, it } from 'vitest'

import type { AreaDelPanel } from './areas-de-servicio'
import { formularioDeArea } from './formulario-de-area'
import { vistaPreviaDeArea } from './vista-previa-de-area'

const GAJO_1 = '72.8,155.8 174.1,78.7 216.5,191.5'
const GAJO_2 = '183.5,77.6 322.0,78.1 284.2,190.3'

const area = (id: number, codigo: string, poligono: string | null): AreaDelPanel => ({
  id,
  codigo,
  nombre: `Área ${codigo}`,
  nombreCorto: `Corto ${codigo}`,
  descripcion: 'Descripción',
  puntos: ['Uno'],
  mensajeDeConsulta: null,
  poligono,
  orden: id,
})

const AREAS = [area(1, 'P1', GAJO_1), area(2, 'P2', GAJO_2), area(3, 'P3', null)]
const POR_DEFECTO = 'Hola, quiero información sobre sus servicios contables.'

const vista = (cambios: Partial<ReturnType<typeof formularioDeArea>> = {}) =>
  vistaPreviaDeArea({
    areas: AREAS,
    idDelArea: 2,
    formulario: { ...formularioDeArea(AREAS[1] ?? area(0, 'P0', null)), ...cambios },
    mensajePorDefecto: POR_DEFECTO,
  })

describe('vistaPreviaDeArea', () => {
  it('pestañas en el orden del sitio, con lo que se escribe en el área editada', () => {
    expect(vista({ nombreCorto: ' Fiscal ' }).pestanas).toEqual([
      { codigo: 'P1', corto: 'Corto P1', actual: false },
      { codigo: 'P2', corto: 'Fiscal', actual: true },
      { codigo: 'P3', corto: 'Corto P3', actual: false },
    ])
  })

  it('la rueda dibuja los gajos válidos y resalta el del área con lo escrito', () => {
    const otro = '1,1 2,2 3,3'
    expect(vista({ poligono: otro }).gajos).toEqual([
      { codigo: 'P1', puntos: GAJO_1, actual: false },
      { codigo: 'P2', puntos: otro, actual: true },
    ])
  })

  it('sin gajo, el área no se marca en la rueda y se avisa', () => {
    const sinGajo = vista({ poligono: '' })
    expect(sinGajo.sinGajo).toBe(true)
    expect(sinGajo.gajos.map((g) => g.codigo)).toEqual(['P1'])
    expect(vista({ poligono: '1,2' }).gajos.some((g) => g.actual)).toBe(false)
  })

  it('la pestaña abierta muestra lo escrito, sin puntos vacíos, y el mensaje por defecto si no hay uno', () => {
    const abierta = vista({
      nombre: '',
      puntos: [
        { clave: 1, texto: ' A ' },
        { clave: 2, texto: '' },
      ],
    })
    expect(abierta).toMatchObject({ nombre: 'Sin nombre', puntos: ['A'], mensaje: POR_DEFECTO })
    expect(vista({ mensaje: ' Hola ' }).mensaje).toBe('Hola')
  })
})
