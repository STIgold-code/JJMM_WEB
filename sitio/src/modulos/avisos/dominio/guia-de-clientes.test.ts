import { describe, expect, it } from 'vitest'

import { type GuiaGuardada, prepararGuia } from './guia-de-clientes'

const GUIA: GuiaGuardada = {
  titulo: 'Guía de clientes',
  introduccion: null,
  tituloDeAvisos: 'Avisos para clientes',
  tituloDeVencimientos: 'Vencimientos tributarios',
  tituloDelCronograma: 'Cronograma de SUNAT',
  seoTitulo: null,
  seoDescripcion: null,
}

describe('prepararGuia', () => {
  it('devuelve los textos de la página', () => {
    expect(prepararGuia(GUIA)).toMatchObject({
      titulo: 'Guía de clientes',
      tituloDeAvisos: 'Avisos para clientes',
      tituloDeVencimientos: 'Vencimientos tributarios',
      tituloDelCronograma: 'Cronograma de SUNAT',
    })
  })

  it('devuelve null si la página nunca se guardó (falta un título obligatorio)', () => {
    expect(prepararGuia({ ...GUIA, titulo: '' })).toBeNull()
    expect(prepararGuia({ ...GUIA, tituloDelCronograma: undefined })).toBeNull()
  })

  it('usa el título de la página para el SEO si el panel no define otro', () => {
    expect(prepararGuia(GUIA)?.seo).toEqual({ titulo: 'Guía de clientes', descripcion: null })
  })

  it('usa la introducción como descripción si no hay descripción SEO', () => {
    const guia = prepararGuia({ ...GUIA, introduccion: 'Lo que debes enviar y cuándo.' })

    expect(guia?.seo.descripcion).toBe('Lo que debes enviar y cuándo.')
  })

  it('prefiere el SEO del panel y descarta textos en blanco', () => {
    const guia = prepararGuia({
      ...GUIA,
      introduccion: '  ',
      seoTitulo: 'Guía para clientes del estudio',
      seoDescripcion: 'Avisos y vencimientos.',
    })

    expect(guia?.introduccion).toBeNull()
    expect(guia?.seo).toEqual({
      titulo: 'Guía para clientes del estudio',
      descripcion: 'Avisos y vencimientos.',
    })
  })
})
