import type { SanitizedPermissions } from 'payload'
import { describe, expect, it } from 'vitest'

import { armarEnlacesRapidos } from './enlaces-rapidos'

const TODO = { create: true, read: true, update: true, delete: true, fields: {} } as const
const EQUIPO: SanitizedPermissions = {
  collections: { publicaciones: TODO, 'avisos-para-clientes': TODO, medios: TODO },
  globals: { 'pagina-de-inicio': TODO },
}

describe('armarEnlacesRapidos', () => {
  const enlaces = armarEnlacesRapidos('/admin', EQUIPO)
  const hrefDe = (clave: string) => enlaces.find((enlace) => enlace.clave === clave)?.href

  it('lleva a lo que más se hace, en este orden', () => {
    expect(enlaces.map(({ clave }) => clave)).toEqual(['publicacion', 'aviso', 'inicio', 'imagen'])
  })

  it('arma las rutas del panel con los slugs reales', () => {
    expect(hrefDe('publicacion')).toBe('/admin/collections/publicaciones/create')
    expect(hrefDe('aviso')).toBe('/admin/collections/avisos-para-clientes/create')
    expect(hrefDe('inicio')).toBe('/admin/globals/pagina-de-inicio')
    expect(hrefDe('imagen')).toBe('/admin/collections/medios/create')
  })

  it('cada acceso tiene un ícono', () => {
    expect(enlaces.every(({ icono }) => icono.length > 0)).toBe(true)
  })

  it('respeta una ruta del panel distinta de /admin', () => {
    expect(armarEnlacesRapidos('/panel', EQUIPO)[0]?.href).toBe(
      '/panel/collections/publicaciones/create',
    )
  })

  it('no ofrece lo que la cuenta no puede hacer', () => {
    const soloLectura: SanitizedPermissions = {
      collections: { publicaciones: { read: true, fields: {} } },
      globals: { 'pagina-de-inicio': { read: true, fields: {} } },
    }
    expect(armarEnlacesRapidos('/admin', soloLectura)).toEqual([])
  })
})
