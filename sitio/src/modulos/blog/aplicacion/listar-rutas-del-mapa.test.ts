import { describe, expect, it } from 'vitest'

import { crearListarRutasDelMapa } from './listar-rutas-del-mapa'

describe('crearListarRutasDelMapa', () => {
  it('arma las rutas del blog con las publicaciones publicadas del repositorio', async () => {
    const listarRutas = crearListarRutasDelMapa({
      async listarParaElMapa() {
        return [
          {
            slug: 'igv',
            actualizadaEn: '2026-11-20T00:00:00.000Z',
            categoria: 'tributacion',
            etiquetas: [],
          },
        ]
      },
    })

    expect(await listarRutas()).toEqual([
      { ruta: '/blog', ultimaModificacion: '2026-11-20T00:00:00.000Z' },
      { ruta: '/blog/igv', ultimaModificacion: '2026-11-20T00:00:00.000Z' },
      { ruta: '/blog/categoria/tributacion', ultimaModificacion: '2026-11-20T00:00:00.000Z' },
    ])
  })
})
