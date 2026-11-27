import { describe, expect, it } from 'vitest'

import { estadoActual } from './item-actual'
import type { ItemDeMenu } from './item-de-menu'

const item = (href: string, seccion: string | null = null, externo = false): ItemDeMenu => ({
  etiqueta: href,
  href,
  seccion,
  externo,
  nuevaPestana: false,
  imagen: null,
})

describe('estadoActual', () => {
  it('marca la sección visible del inicio y nada más', () => {
    const planes = item('/#planes', 'planes')

    expect(estadoActual(planes, 'planes', '/')).toBe('true')
    expect(estadoActual(item('/'), 'planes', '/')).toBeUndefined()
    expect(estadoActual(item('/#servicios', 'servicios'), 'planes', '/')).toBeUndefined()
  })

  it('sin sección visible, marca la página interna en la que se está', () => {
    expect(estadoActual(item('/'), null, '/')).toBe('page')
    expect(estadoActual(item('/blog'), null, '/blog')).toBe('page')
    expect(estadoActual(item('/guia'), null, '/blog')).toBeUndefined()
  })

  it('marca la página padre en sus páginas de detalle, salvo el inicio', () => {
    expect(estadoActual(item('/blog'), null, '/blog/cierre-tributario')).toBe('page')
    expect(estadoActual(item('/'), null, '/blog')).toBeUndefined()
  })

  it('nunca marca un enlace externo ni una sección fuera de su vista', () => {
    expect(estadoActual(item('https://sigefact.pse.pe/', null, true), null, '/')).toBeUndefined()
    expect(estadoActual(item('/#planes', 'planes'), null, '/')).toBeUndefined()
  })
})
