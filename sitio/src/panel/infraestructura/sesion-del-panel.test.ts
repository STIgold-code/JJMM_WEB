import { beforeEach, describe, expect, it, vi } from 'vitest'

// La guardia se prueba por su interfaz pública con dobles de Next y de Payload: sin base de
// datos ni servidor.
const dobles = vi.hoisted(() => ({
  auth: vi.fn(),
  headers: vi.fn(async () => new Headers({ cookie: 'payload-token=abc' })),
  redirect: vi.fn((ruta: string) => {
    throw new Error(`REDIRECCION ${ruta}`)
  }),
}))

vi.mock('next/headers', () => ({ headers: dobles.headers }))
vi.mock('next/navigation', () => ({ redirect: dobles.redirect }))
vi.mock('@/compartido/infraestructura/instancia-payload', () => ({
  obtenerPayload: async () => ({ auth: dobles.auth }),
}))

const { exigirSesion, obtenerSesion } = await import('./sesion-del-panel')

const PERMISOS = { collections: {} }

beforeEach(() => {
  dobles.auth.mockReset()
  dobles.redirect.mockClear()
})

describe('guardia del panel', () => {
  it('sin sesión lleva al ingreso y no devuelve nada', async () => {
    dobles.auth.mockResolvedValue({ user: null, permissions: PERMISOS })
    await expect(exigirSesion()).rejects.toThrow('REDIRECCION /panel/ingreso')
    expect(dobles.redirect).toHaveBeenCalledWith('/panel/ingreso')
  })

  it('una cuenta sin rol del equipo no tiene sesión en el panel', async () => {
    dobles.auth.mockResolvedValue({ user: { id: 1, rol: 'otro' }, permissions: PERMISOS })
    expect(await obtenerSesion()).toBeNull()
    await expect(exigirSesion()).rejects.toThrow('REDIRECCION /panel/ingreso')
  })

  it('valida la sesión con las cabeceras de la petición (la cookie de Payload)', async () => {
    dobles.auth.mockResolvedValue({ user: null, permissions: PERMISOS })
    await obtenerSesion()
    const [{ headers }] = dobles.auth.mock.calls[0] as [{ headers: Headers }]
    expect(headers.get('cookie')).toBe('payload-token=abc')
  })

  it('con una sesión del equipo devuelve el usuario y sus permisos sin redirigir', async () => {
    const usuario = { id: 1, rol: 'editor', email: 'e@jjmm.pe' }
    dobles.auth.mockResolvedValue({ user: usuario, permissions: PERMISOS })
    const sesion = await exigirSesion()
    expect(sesion.usuario).toBe(usuario)
    expect(sesion.permisos).toBe(PERMISOS)
    expect(dobles.redirect).not.toHaveBeenCalled()
  })
})
