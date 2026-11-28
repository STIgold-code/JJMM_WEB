import { describe, expect, it } from 'vitest'

import { cifrasDelSitio } from './cifras'

const TODAS = {
  planes: 4,
  areas: 9,
  sedesActivas: 2,
  clientesActivos: 11,
  avisosActivos: 3,
  vencimientos: 14,
}

describe('cifrasDelSitio', () => {
  it('lista lo que publica el sitio, con su ícono, en el orden de la maqueta', () => {
    expect(
      cifrasDelSitio(TODAS).map(({ etiqueta, cantidad, icono }) => [etiqueta, cantidad, icono]),
    ).toEqual([
      ['Planes', 4, 'capas'],
      ['Áreas de servicio', 9, 'maletin'],
      ['Sedes activas', 2, 'pin'],
      ['Clientes en el inicio', 11, 'edificio'],
      ['Avisos para clientes', 3, 'libro'],
      ['Vencimientos', 14, 'calendario'],
    ])
  })

  it('omite la cifra que la cuenta no puede leer', () => {
    const cifras = cifrasDelSitio({ ...TODAS, planes: null, vencimientos: null })
    expect(cifras.map((c) => c.clave)).toEqual(['areas', 'sedes', 'clientes', 'avisos'])
  })

  it('«Planes» lleva a su sección del panel', () => {
    expect(cifrasDelSitio(TODAS)[0]?.href).toBe('/panel/planes')
  })

  it('las demás cifras llevan a su lista en /admin mientras su sección del panel no exista', () => {
    expect(cifrasDelSitio(TODAS)[1]?.href).toBe('/admin/collections/areas-de-servicio')
  })
})
