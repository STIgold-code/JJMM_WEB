import { describe, expect, it } from 'vitest'

import { formularioDesdeGuardado } from './formulario-de-plan'
import type { InclusionDelPanel, PlanDelPanel } from './planes'
import { vistaPreviaDePlanes } from './vista-previa-de-planes'

const plan = (id: number, nombre: string, visible = true): PlanDelPanel => ({
  id,
  nombre,
  mensajeDeConsulta: null,
  visible,
  orden: id,
})
const PLANES = [plan(1, 'Emprende'), plan(2, 'Oculto', false), plan(3, 'SIGEMype II')]
const CARACTERISTICAS = [
  { id: 10, nombre: 'Planilla hasta' },
  { id: 11, nombre: 'Libro Bancos' },
]
const INCLUSIONES: InclusionDelPanel[] = [
  { id: 1, plan: 1, caracteristica: 10, tipo: 'texto', texto: '2 trabajadores' },
  { id: 2, plan: 3, caracteristica: 11, tipo: 'incluido', texto: null },
]

const datos = (editado: PlanDelPanel = PLANES[2]!) => ({
  planes: PLANES,
  caracteristicas: CARACTERISTICAS,
  inclusiones: INCLUSIONES,
  idDelPlan: editado.id,
})

describe('vistaPreviaDePlanes', () => {
  it('muestra los planes visibles en su orden y resalta el que se edita', () => {
    const formulario = formularioDesdeGuardado(PLANES[2]!, CARACTERISTICAS, INCLUSIONES)
    const vista = vistaPreviaDePlanes({ ...datos(), formulario })
    expect(vista.columnas).toEqual([
      { nombre: 'Emprende', editado: false },
      { nombre: 'SIGEMype II', editado: true },
    ])
    expect(vista.filas).toEqual([
      {
        caracteristica: 'Planilla hasta',
        celdas: [{ tipo: 'texto', texto: '2 trabajadores' }, { tipo: 'no-incluido' }],
      },
      { caracteristica: 'Libro Bancos', celdas: [{ tipo: 'no-incluido' }, { tipo: 'incluido' }] },
    ])
    expect(vista.planOculto).toBe(false)
  })

  it('refleja lo que se escribe antes de guardar: nombre y celdas', () => {
    const guardado = formularioDesdeGuardado(PLANES[2]!, CARACTERISTICAS, INCLUSIONES)
    const formulario = {
      ...guardado,
      nombre: 'SIGEMype III',
      celdas: [
        { caracteristica: 10, tipo: 'texto' as const, texto: 'Consultar' },
        { caracteristica: 11, tipo: 'texto' as const, texto: '   ' },
      ],
    }
    const vista = vistaPreviaDePlanes({ ...datos(), formulario })
    expect(vista.columnas[1]).toEqual({ nombre: 'SIGEMype III', editado: true })
    expect(vista.filas.map((f) => f.celdas[1])).toEqual([
      { tipo: 'texto', texto: 'Consultar' },
      { tipo: 'no-incluido' },
    ])
  })

  it('al ocultar el plan, su columna sale de la tabla y se avisa', () => {
    const guardado = formularioDesdeGuardado(PLANES[2]!, CARACTERISTICAS, INCLUSIONES)
    const vista = vistaPreviaDePlanes({ ...datos(), formulario: { ...guardado, visible: false } })
    expect(vista.columnas).toEqual([{ nombre: 'Emprende', editado: false }])
    expect(vista.planOculto).toBe(true)
  })

  it('un plan oculto que se vuelve visible aparece en su lugar', () => {
    const guardado = formularioDesdeGuardado(PLANES[1]!, CARACTERISTICAS, INCLUSIONES)
    const vista = vistaPreviaDePlanes({
      ...datos(PLANES[1]),
      formulario: { ...guardado, visible: true },
    })
    expect(vista.columnas.map((c) => c.nombre)).toEqual(['Emprende', 'Oculto', 'SIGEMype II'])
  })

  it('un nombre en blanco se muestra como «Sin nombre»', () => {
    const guardado = formularioDesdeGuardado(PLANES[2]!, CARACTERISTICAS, INCLUSIONES)
    const vista = vistaPreviaDePlanes({ ...datos(), formulario: { ...guardado, nombre: ' ' } })
    expect(vista.columnas[1]?.nombre).toBe('Sin nombre')
  })
})
