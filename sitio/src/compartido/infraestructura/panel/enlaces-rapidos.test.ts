import { describe, expect, it } from 'vitest'

import { armarEnlacesRapidos } from './enlaces-rapidos'

describe('armarEnlacesRapidos', () => {
  const enlaces = armarEnlacesRapidos('/admin')
  const hrefDe = (clave: string) => enlaces.find((enlace) => enlace.clave === clave)?.href

  it('lleva a lo que más se edita, en este orden', () => {
    expect(enlaces.map(({ clave }) => clave)).toEqual([
      'inicio',
      'avisos',
      'publicacion',
      'mensajes',
    ])
  })

  it('arma las rutas del panel con los slugs reales', () => {
    expect(hrefDe('inicio')).toBe('/admin/globals/pagina-de-inicio')
    expect(hrefDe('avisos')).toBe('/admin/collections/avisos-para-clientes')
    expect(hrefDe('publicacion')).toBe('/admin/collections/publicaciones/create')
    expect(hrefDe('mensajes')).toBe('/admin/collections/mensajes-de-contacto')
  })

  it('respeta una ruta del panel distinta de /admin', () => {
    expect(armarEnlacesRapidos('/panel')[0]?.href).toBe('/panel/globals/pagina-de-inicio')
  })
})
