import { AuthenticationError, LockedAuth } from 'payload'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  ERROR_AL_GUARDAR_LA_CUENTA,
  ERROR_CLAVE_ACTUAL_INCORRECTA,
  ERROR_CUENTA_BLOQUEADA,
} from '../aplicacion/mi-cuenta'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// «Mi cuenta» por su interfaz pública, con la guardia y el adaptador reales (solo Next y la Local
// API son dobles): la cuenta sale de la sesión, nunca del formulario, y la contraseña actual se
// comprueba con `payload.login`.
vi.mock('next/headers', () => ({ headers: async () => new Headers() }))
vi.mock('next/navigation', async () => ({
  redirect: (await import('./prueba/dobles-de-payload')).redireccionDePrueba,
}))
vi.mock('next/cache', async () => ({
  revalidatePath: (await import('./prueba/dobles-de-payload')).dobles.revalidatePath,
}))
vi.mock('@/compartido/infraestructura/instancia-payload', async () => {
  const { payloadDoble } = await import('./prueba/dobles-de-payload')
  return { obtenerPayload: async () => payloadDoble }
})

const { cambiarLaContrasenaPropia, guardarElNombrePropio } = await import('./cuenta')

const CAMBIO = {
  actual: 'clave de antes',
  nueva: 'clave nueva larga',
  repetida: 'clave nueva larga',
}

const ACCIONES = [
  ['guardarElNombrePropio', () => guardarElNombrePropio({ nombre: 'Carmen' })],
  ['cambiarLaContrasenaPropia', () => cambiarLaContrasenaPropia(CAMBIO)],
] as const

beforeEach(() => {
  reiniciarDobles({})
  dobles.update.mockResolvedValue({ id: 2 })
  dobles.login.mockResolvedValue({ token: 'jwt', user: EDITOR })
})

describe('«Mi cuenta» sin sesión (S4.3)', () => {
  it.each(ACCIONES)('%s lleva al ingreso y no escribe nada', async (_, accion) => {
    conSesion(null)
    await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
    nadaSeEscribio()
  })
})

describe('guardarElNombrePropio', () => {
  it('un editor cambia solo su nombre: ni su rol ni otra cuenta, aunque los mande', async () => {
    conSesion(EDITOR)
    const formulario = { nombre: ' Carmen ', rol: 'administrador', id: 1, email: 'x@x.pe' }
    expect((await guardarElNombrePropio(formulario)).estado).toBe('guardado')
    expect(dobles.update).toHaveBeenCalledWith({
      collection: 'usuarios',
      id: EDITOR.id,
      data: { nombre: 'Carmen' },
      overrideAccess: false,
      user: EDITOR,
      depth: 0,
    })
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un 400 vuelve como aviso, sin lanzar; otro error se propaga', async () => {
    conSesion(EDITOR)
    dobles.update.mockRejectedValueOnce({ status: 400, data: { errors: [{ path: 'nombre' }] } })
    expect(await guardarElNombrePropio({ nombre: 'Carmen' })).toEqual({
      estado: 'error',
      error: ERROR_AL_GUARDAR_LA_CUENTA,
    })
    dobles.update.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(guardarElNombrePropio({ nombre: 'Carmen' })).rejects.toThrow('sin conexión')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('cambiarLaContrasenaPropia', () => {
  it('verifica la actual con el ingreso de Payload y guarda solo la nueva, en su cuenta', async () => {
    conSesion(ADMINISTRADOR)
    const estado = await cambiarLaContrasenaPropia({ ...CAMBIO, id: 2 })
    expect(estado.estado).toBe('cambiada')
    expect(dobles.login).toHaveBeenCalledWith({
      collection: 'usuarios',
      data: { email: ADMINISTRADOR.email, password: CAMBIO.actual },
    })
    expect(dobles.update).toHaveBeenCalledWith({
      collection: 'usuarios',
      id: ADMINISTRADOR.id,
      data: { password: CAMBIO.nueva },
      overrideAccess: false,
      user: ADMINISTRADOR,
      depth: 0,
    })
    expect(JSON.stringify(estado)).not.toContain(CAMBIO.nueva)
  })

  it('con la contraseña actual equivocada no cambia nada y lo dice en el campo', async () => {
    conSesion(EDITOR)
    dobles.login.mockRejectedValueOnce(new AuthenticationError())
    expect(await cambiarLaContrasenaPropia(CAMBIO)).toEqual({
      estado: 'invalido',
      errores: { actual: ERROR_CLAVE_ACTUAL_INCORRECTA },
    })
    expect(dobles.update).not.toHaveBeenCalled()
  })

  it('con la cuenta bloqueada por intentos no cambia nada', async () => {
    conSesion(EDITOR)
    dobles.login.mockRejectedValueOnce(new LockedAuth())
    expect(await cambiarLaContrasenaPropia(CAMBIO)).toEqual({
      estado: 'error',
      error: ERROR_CUENTA_BLOQUEADA,
    })
    expect(dobles.update).not.toHaveBeenCalled()
  })

  it('un formulario inválido no gasta un intento de ingreso', async () => {
    conSesion(EDITOR)
    expect((await cambiarLaContrasenaPropia({ ...CAMBIO, nueva: 'corta' })).estado).toBe('invalido')
    nadaSeEscribio()
  })

  it('un error que no es de credenciales se propaga y no cambia nada', async () => {
    conSesion(EDITOR)
    dobles.login.mockRejectedValueOnce(new Error('base caída'))
    await expect(cambiarLaContrasenaPropia(CAMBIO)).rejects.toThrow('base caída')
    expect(dobles.update).not.toHaveBeenCalled()
  })
})
