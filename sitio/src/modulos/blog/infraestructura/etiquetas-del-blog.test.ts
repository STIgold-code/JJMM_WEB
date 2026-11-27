import { describe, expect, it } from 'vitest'

import { etiquetaDeColeccion, etiquetaDeDocumento } from '@/compartido/dominio/etiquetas-de-cache'

import { etiquetasDelDetalle, etiquetasDelListado } from './etiquetas-del-blog'

describe('etiquetas de caché del blog', () => {
  it('el detalle se invalida al cambiar cualquier publicación, porque su contenido enlaza a otras', () => {
    expect(etiquetasDelDetalle('mi-articulo')).toContain(etiquetaDeColeccion('publicaciones'))
  })

  it('el detalle conserva la etiqueta de su propio slug', () => {
    expect(etiquetasDelDetalle('mi-articulo')).toContain(
      etiquetaDeDocumento('publicaciones', 'mi-articulo'),
    )
  })

  it('el detalle y el listado se invalidan al cambiar categorías, etiquetas o medios', () => {
    const relaciones = ['categorias', 'etiquetas', 'medios'].map(etiquetaDeColeccion)

    expect(etiquetasDelDetalle('mi-articulo')).toEqual(expect.arrayContaining(relaciones))
    expect(etiquetasDelListado()).toEqual(expect.arrayContaining(relaciones))
  })

  it('el listado se invalida al cambiar cualquier publicación', () => {
    expect(etiquetasDelListado()).toContain(etiquetaDeColeccion('publicaciones'))
  })
})
