import { describe, expect, it } from 'vitest'

import { type PublicacionDelMapa, rutasDelMapaDelBlog } from './mapa-del-blog'

const publicacion = (
  slug: string,
  actualizadaEn: string,
  categoria: string | null,
  etiquetas: readonly string[] = [],
): PublicacionDelMapa => ({ slug, actualizadaEn, categoria, etiquetas })

describe('rutasDelMapaDelBlog', () => {
  it('sin publicaciones solo lista /blog, sin fecha', () => {
    expect(rutasDelMapaDelBlog([])).toEqual([{ ruta: '/blog', ultimaModificacion: null }])
  })

  it('lista el blog, cada publicación y las categorías y etiquetas que tienen publicaciones', () => {
    const rutas = rutasDelMapaDelBlog([
      publicacion('igv', '2026-11-20T00:00:00.000Z', 'tributacion', ['sunat', 'igv']),
      publicacion('planilla', '2026-11-25T00:00:00.000Z', 'laboral', ['sunat']),
      publicacion('renta', '2026-11-22T00:00:00.000Z', 'tributacion'),
    ])

    expect(rutas).toEqual([
      { ruta: '/blog', ultimaModificacion: '2026-11-25T00:00:00.000Z' },
      { ruta: '/blog/igv', ultimaModificacion: '2026-11-20T00:00:00.000Z' },
      { ruta: '/blog/planilla', ultimaModificacion: '2026-11-25T00:00:00.000Z' },
      { ruta: '/blog/renta', ultimaModificacion: '2026-11-22T00:00:00.000Z' },
      { ruta: '/blog/categoria/tributacion', ultimaModificacion: '2026-11-22T00:00:00.000Z' },
      { ruta: '/blog/categoria/laboral', ultimaModificacion: '2026-11-25T00:00:00.000Z' },
      { ruta: '/blog/etiqueta/sunat', ultimaModificacion: '2026-11-25T00:00:00.000Z' },
      { ruta: '/blog/etiqueta/igv', ultimaModificacion: '2026-11-20T00:00:00.000Z' },
    ])
  })

  it('no repite rutas', () => {
    const rutas = rutasDelMapaDelBlog([
      publicacion('a', '2026-11-20T00:00:00.000Z', 'tributacion', ['sunat', 'sunat']),
      publicacion('b', '2026-11-21T00:00:00.000Z', 'tributacion', ['sunat']),
    ])

    const soloRutas = rutas.map(({ ruta }) => ruta)
    expect(new Set(soloRutas).size).toBe(soloRutas.length)
  })
})
