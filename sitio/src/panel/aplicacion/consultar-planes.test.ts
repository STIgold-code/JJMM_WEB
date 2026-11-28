import { describe, expect, it } from 'vitest'

import {
  obtenerEdicionDePlan,
  obtenerListadoDePlanes,
  type RepositorioDeLecturaDePlanes,
  TEXTOS_PREDETERMINADOS,
} from './consultar-planes'

const repositorio = (textos = TEXTOS_PREDETERMINADOS): RepositorioDeLecturaDePlanes => ({
  listarPlanes: async () => [
    { id: 1, nombre: 'Emprende', mensajeDeConsulta: null, visible: true, orden: 0 },
    { id: 2, nombre: 'SIGEMype I', mensajeDeConsulta: 'Hola', visible: false, orden: 1 },
  ],
  listarCaracteristicas: async () => [
    { id: 10, nombre: 'Libro Bancos' },
    { id: 11, nombre: 'Kardex' },
  ],
  listarInclusiones: async () => [
    { id: 100, plan: 1, caracteristica: 10, tipo: 'incluido', texto: null },
    { id: 101, plan: 1, caracteristica: 11, tipo: 'no-incluido', texto: null },
    { id: 102, plan: 2, caracteristica: 10, tipo: 'texto', texto: 'Consultar' },
  ],
  leerTextosDeLaSeccion: async () => textos,
})

describe('obtenerListadoDePlanes', () => {
  it('lista los planes con cuántas características incluye cada uno', async () => {
    const datos = await obtenerListadoDePlanes(repositorio())
    expect(datos.caracteristicas).toBe(2)
    expect(datos.planes.map((p) => [p.nombre, p.incluidas, p.visible])).toEqual([
      ['Emprende', 1, true],
      ['SIGEMype I', 1, false],
    ])
  })
})

describe('obtenerEdicionDePlan', () => {
  it('arma el formulario del plan y cuenta sus celdas guardadas', async () => {
    const datos = await obtenerEdicionDePlan(repositorio(), '2')
    expect(datos?.plan.nombre).toBe('SIGEMype I')
    expect(datos?.formulario.celdas).toEqual([
      { caracteristica: 10, tipo: 'texto', texto: 'Consultar' },
      { caracteristica: 11, tipo: 'no-incluido', texto: '' },
    ])
    expect(datos?.celdasGuardadas).toBe(1)
  })

  it('sin la sección en la página de inicio usa los textos predeterminados', async () => {
    const sinSeccion = { ...repositorio(), leerTextosDeLaSeccion: async () => null }
    expect((await obtenerEdicionDePlan(sinSeccion, 1))?.textos).toEqual(TEXTOS_PREDETERMINADOS)
  })

  it.each(['abc', '0', 99, undefined])('con el id %s no hay plan que editar', async (id) => {
    expect(await obtenerEdicionDePlan(repositorio(), id)).toBeNull()
  })
})
