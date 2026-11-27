import { beforeEach, describe, expect, it, vi } from 'vitest'

const dobles = vi.hoisted(() => ({
  obtenerSesion: vi.fn(),
  cerrarSesion: vi.fn(),
  redirect: vi.fn((ruta: string) => {
    throw new Error(`REDIRECCION ${ruta}`)
  }),
}))

vi.mock('next/navigation', () => ({ redirect: dobles.redirect }))
vi.mock('../infraestructura/sesion-del-panel', () => ({ obtenerSesion: dobles.obtenerSesion }))
vi.mock('../infraestructura/autenticacion-payload', () => ({
  cerrarSesionEnPayload: dobles.cerrarSesion,
}))

const { salirDelPanel } = await import('./salida')

beforeEach(() => {
  dobles.obtenerSesion.mockReset()
  dobles.cerrarSesion.mockReset()
})

describe('salirDelPanel', () => {
  it('sin sesión no escribe nada y lleva al ingreso', async () => {
    dobles.obtenerSesion.mockResolvedValue(null)
    await expect(salirDelPanel()).rejects.toThrow('REDIRECCION /panel/ingreso')
    expect(dobles.cerrarSesion).not.toHaveBeenCalled()
  })

  it('con sesión la cierra en Payload y lleva al ingreso', async () => {
    const sesion = { usuario: { id: 1 } }
    dobles.obtenerSesion.mockResolvedValue(sesion)
    await expect(salirDelPanel()).rejects.toThrow('REDIRECCION /panel/ingreso')
    expect(dobles.cerrarSesion).toHaveBeenCalledWith(sesion)
  })
})
