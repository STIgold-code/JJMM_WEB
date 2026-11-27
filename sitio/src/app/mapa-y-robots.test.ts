import { describe, expect, it } from 'vitest'

import { entradasDelMapa, reglasDeRobots, RUTAS_FIJAS_DEL_MAPA } from './mapa-y-robots'

const ORIGEN = new URL('https://sigemype.com')

describe('entradasDelMapa', () => {
  it('vuelve absolutas las rutas y agrega la fecha solo si existe', () => {
    expect(
      entradasDelMapa(ORIGEN, [
        { ruta: '/', ultimaModificacion: null },
        { ruta: '/blog/igv', ultimaModificacion: '2026-11-20T00:00:00.000Z' },
      ]),
    ).toEqual([
      { url: 'https://sigemype.com/' },
      { url: 'https://sigemype.com/blog/igv', lastModified: '2026-11-20T00:00:00.000Z' },
    ])
  })

  it('las rutas fijas son el inicio y la guía de clientes', () => {
    expect(RUTAS_FIJAS_DEL_MAPA.map(({ ruta }) => ruta)).toEqual(['/', '/guia'])
  })
})

describe('reglasDeRobots', () => {
  it('permite todo menos los paneles y la API, salvo los archivos de medios, y enlaza el sitemap', () => {
    expect(reglasDeRobots(ORIGEN)).toEqual({
      rules: [
        {
          userAgent: '*',
          allow: ['/', '/api/medios/file/'],
          disallow: ['/admin', '/panel', '/api'],
        },
      ],
      sitemap: 'https://sigemype.com/sitemap.xml',
    })
  })
})
