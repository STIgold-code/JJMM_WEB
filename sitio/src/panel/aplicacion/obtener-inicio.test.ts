import { describe, expect, it } from 'vitest'

import { obtenerInicio, type RepositorioDelInicio } from './obtener-inicio'

const repositorio = (cambios: Partial<RepositorioDelInicio> = {}): RepositorioDelInicio => ({
  contarMensajesNuevos: async () => 2,
  contarBorradores: async () => 1,
  listarMensajesNuevos: async () => [
    { id: 1, nombre: 'Carmen', servicio: 'Planilla', recibido: '2026-11-27T10:00:00Z' },
  ],
  listarBorradores: async () => [{ id: 9, titulo: 'Cierre', actualizado: '2026-11-26T10:00:00Z' }],
  contarContenido: async () => ({
    planes: 4,
    areas: 9,
    sedesActivas: 2,
    clientesActivos: 11,
    avisosActivos: 3,
    vencimientos: 14,
  }),
  leerAvance: async () => ({
    digitosDelCronograma: 0,
    sedes: { activas: 2, conCelular: 2 },
    publicadas: 0,
  }),
  ...cambios,
})

describe('obtenerInicio', () => {
  it('arma tarjetas, cifras, pendientes y faltantes con los datos reales', async () => {
    const inicio = await obtenerInicio(repositorio())
    expect(inicio.tarjetas.map(({ clave, cantidad }) => [clave, cantidad])).toEqual([
      ['mensajes', 2],
      ['borradores', 1],
      ['datos', 2],
    ])
    expect(inicio.cifras).toHaveLength(6)
    expect(inicio.pendientes?.map((f) => f.clave)).toEqual(['mensaje-1', 'borrador-9'])
    expect(inicio.faltantes.map((f) => f.clave)).toEqual(['cronograma', 'sedes', 'publicaciones'])
  })

  it('sin permiso para leer mensajes ni publicaciones, no muestra sus tarjetas ni la tabla', async () => {
    const inicio = await obtenerInicio(
      repositorio({
        contarMensajesNuevos: async () => null,
        contarBorradores: async () => null,
        listarMensajesNuevos: async () => null,
        listarBorradores: async () => null,
      }),
    )
    expect(inicio.tarjetas.map((t) => t.clave)).toEqual(['datos'])
    expect(inicio.pendientes).toBeNull()
  })

  it('si no hay nada que medir, no muestra la tarjeta «Datos por completar»', async () => {
    const inicio = await obtenerInicio(
      repositorio({
        leerAvance: async () => ({ digitosDelCronograma: null, sedes: null, publicadas: null }),
      }),
    )
    expect(inicio.tarjetas.map((t) => t.clave)).toEqual(['mensajes', 'borradores'])
    expect(inicio.faltantes).toEqual([])
  })
})
