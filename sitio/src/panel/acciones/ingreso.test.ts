import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ESTADO_INICIAL_DEL_INGRESO, MENSAJE_DE_INGRESO_RECHAZADO } from '../dominio/ingreso'

const dobles = vi.hoisted(() => ({
  autenticar: vi.fn(),
  redirect: vi.fn((ruta: string) => {
    throw new Error(`REDIRECCION ${ruta}`)
  }),
}))

vi.mock('next/navigation', () => ({ redirect: dobles.redirect }))
vi.mock('../infraestructura/autenticacion-payload', () => ({
  autenticarConPayload: dobles.autenticar,
}))

const { ingresarAlPanel } = await import('./ingreso')

const formulario = (correo: string, clave: string) => {
  const datos = new FormData()
  datos.set('correo', correo)
  datos.set('clave', clave)
  return datos
}

beforeEach(() => {
  dobles.autenticar.mockReset()
  dobles.redirect.mockClear()
})

describe('ingresarAlPanel', () => {
  it('con credenciales erróneas devuelve el mensaje único y no entra', async () => {
    dobles.autenticar.mockResolvedValue('rechazado')
    const estado = await ingresarAlPanel(ESTADO_INICIAL_DEL_INGRESO, formulario('a@jjmm.pe', 'x'))
    // El correo vuelve para no tener que escribirlo otra vez; la contraseña, nunca.
    expect(estado).toEqual({ error: MENSAJE_DE_INGRESO_RECHAZADO, correo: 'a@jjmm.pe' })
    expect(JSON.stringify(estado)).not.toContain('"x"')
    expect(dobles.redirect).not.toHaveBeenCalled()
  })

  it('el mensaje es el mismo si falta el correo o la contraseña, sin intentar autenticar', async () => {
    const sinCorreo = await ingresarAlPanel(ESTADO_INICIAL_DEL_INGRESO, formulario('', 'clave'))
    const sinClave = await ingresarAlPanel(ESTADO_INICIAL_DEL_INGRESO, formulario('a@jjmm.pe', ''))
    expect(sinCorreo.error).toBe(MENSAJE_DE_INGRESO_RECHAZADO)
    expect(sinClave.error).toBe(sinCorreo.error)
    expect(dobles.autenticar).not.toHaveBeenCalled()
  })

  it('con credenciales válidas lleva al inicio del panel', async () => {
    dobles.autenticar.mockResolvedValue('aceptado')
    await expect(
      ingresarAlPanel(ESTADO_INICIAL_DEL_INGRESO, formulario('a@jjmm.pe', 'clave')),
    ).rejects.toThrow('REDIRECCION /panel')
  })
})
