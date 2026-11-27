import { describe, expect, it } from 'vitest'

import { type AreaGuardada, crearListarAreas } from './listar-areas'

const area = (poligonoEnLaRueda: string | null): AreaGuardada => ({
  codigo: 'P1',
  nombre: 'Legal',
  nombreCorto: 'Legal',
  descripcion: 'Asesoría legal.',
  puntos: ['Asesoría legal'],
  mensajeDeConsulta: null,
  poligonoEnLaRueda,
})

describe('crearListarAreas', () => {
  it('entrega las áreas en el orden del repositorio y conserva los gajos válidos', async () => {
    const listar = crearListarAreas({ listar: async () => [area('1,1 2,2 3,3 ')] })

    expect(await listar()).toEqual([area('1,1 2,2 3,3')])
  })

  it('quita el gajo con puntos inválidos o vacío sin quitar el área', async () => {
    const listar = crearListarAreas({ listar: async () => [area('1,1 2,2'), area(''), area(null)] })

    expect((await listar()).map((a) => a.poligonoEnLaRueda)).toEqual([null, null, null])
  })
})
