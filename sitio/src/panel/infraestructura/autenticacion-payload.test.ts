import { AuthenticationError, LockedAuth } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const dobles = vi.hoisted(() => ({
  login: vi.fn(),
  set: vi.fn(),
  logoutOperation: vi.fn(async () => true),
}))

vi.mock('next/headers', () => ({ cookies: async () => ({ set: dobles.set }) }))
vi.mock('payload', async (original) => ({
  ...(await original<typeof import('payload')>()),
  createLocalReq: async (opciones: object) => opciones,
  logoutOperation: dobles.logoutOperation,
}))

const AUTH = { cookies: { sameSite: 'Lax', secure: true }, tokenExpiration: 7200 }
const PAYLOAD = {
  login: dobles.login,
  collections: { usuarios: { config: { auth: AUTH } } },
  config: { cookiePrefix: 'payload' },
}

vi.mock('@/compartido/infraestructura/instancia-payload', () => ({
  obtenerPayload: async () => PAYLOAD,
}))

const { autenticarConPayload, cerrarSesionEnPayload } = await import('./autenticacion-payload')

const CREDENCIALES = { correo: 'a@jjmm.pe', clave: 'clave' }

beforeEach(() => {
  dobles.login.mockReset()
  dobles.set.mockReset()
  dobles.logoutOperation.mockClear()
})

describe('autenticarConPayload', () => {
  it('con credenciales válidas deja la cookie de sesión de Payload, solo para el servidor', async () => {
    dobles.login.mockResolvedValue({ token: 'jwt' })
    expect(await autenticarConPayload(CREDENCIALES)).toBe('aceptado')
    expect(dobles.login).toHaveBeenCalledWith({
      collection: 'usuarios',
      data: { email: 'a@jjmm.pe', password: 'clave' },
    })
    expect(dobles.set).toHaveBeenCalledWith(
      'payload-token',
      'jwt',
      expect.objectContaining({ httpOnly: true, path: '/', sameSite: 'lax', secure: true }),
    )
  })

  it.each([
    ['contraseña o correo equivocados', new AuthenticationError()],
    ['cuenta bloqueada por intentos fallidos', new LockedAuth()],
  ])('%s: rechaza sin dejar cookie', async (_caso, error) => {
    dobles.login.mockRejectedValue(error)
    expect(await autenticarConPayload(CREDENCIALES)).toBe('rechazado')
    expect(dobles.set).not.toHaveBeenCalled()
  })

  it('un error que no es de credenciales se propaga', async () => {
    dobles.login.mockRejectedValue(new Error('base caída'))
    await expect(autenticarConPayload(CREDENCIALES)).rejects.toThrow('base caída')
    expect(dobles.set).not.toHaveBeenCalled()
  })
})

describe('cerrarSesionEnPayload', () => {
  it('invalida la sesión en Payload y vence la cookie', async () => {
    const usuario = { id: 1, rol: 'editor' }
    const sesion = { payload: PAYLOAD, usuario, permisos: {} } as unknown as Parameters<
      typeof cerrarSesionEnPayload
    >[0] // Doble parcial: solo lo que usa la función.
    await cerrarSesionEnPayload(sesion)
    expect(dobles.logoutOperation).toHaveBeenCalledWith(
      expect.objectContaining({ req: { user: usuario } }),
    )
    const [nombre, valor, opciones] = dobles.set.mock.calls[0] as [
      string,
      string,
      { expires: Date },
    ]
    expect([nombre, valor]).toEqual(['payload-token', ''])
    expect(opciones.expires.getTime()).toBeLessThan(Date.now())
  })
})
