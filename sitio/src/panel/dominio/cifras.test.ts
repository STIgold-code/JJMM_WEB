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

  it('«Planes» y «Sedes activas» llevan a su sección del panel', () => {
    expect(cifrasDelSitio(TODAS)[0]?.href).toBe('/panel/planes')
    expect(cifrasDelSitio(TODAS)[2]?.href).toBe('/panel/sedes')
  })

  it('«Avisos para clientes» y «Vencimientos» llevan a su parte de la guía de clientes', () => {
    expect(cifrasDelSitio(TODAS)[4]?.href).toBe('/panel/guia#avisos')
    expect(cifrasDelSitio(TODAS)[5]?.href).toBe('/panel/guia#vencimientos')
  })

  it('«Áreas de servicio» y «Clientes en el inicio» llevan a su sección del panel', () => {
    expect(cifrasDelSitio(TODAS)[1]?.href).toBe('/panel/areas')
    expect(cifrasDelSitio(TODAS)[3]?.href).toBe('/panel/clientes')
  })

  it('ninguna cifra lleva ya al /admin', () => {
    expect(cifrasDelSitio(TODAS).filter((c) => c.href.startsWith('/admin'))).toEqual([])
  })
})
