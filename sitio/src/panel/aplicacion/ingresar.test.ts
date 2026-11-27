import { describe, expect, it, vi } from 'vitest'

import { MENSAJE_DE_INGRESO_RECHAZADO } from '../dominio/ingreso'
import { ingresar } from './ingresar'

describe('ingresar', () => {
  it('con credenciales aceptadas, ingresa sin error', async () => {
    const autenticar = vi.fn().mockResolvedValue('aceptado')
    expect(await ingresar(' a@jjmm.pe ', 'clave', autenticar)).toEqual({
      aceptado: true,
      error: null,
    })
    expect(autenticar).toHaveBeenCalledWith({ correo: 'a@jjmm.pe', clave: 'clave' })
  })

  it('con credenciales rechazadas, da un único mensaje que no dice qué campo falló', async () => {
    const autenticar = vi.fn().mockResolvedValue('rechazado')
    const resultado = await ingresar('a@jjmm.pe', 'mala', autenticar)
    expect(resultado).toEqual({ aceptado: false, error: MENSAJE_DE_INGRESO_RECHAZADO })
    expect(resultado.error).not.toMatch(/no existe|no registrado|bloquead[ao] la cuenta/i)
  })

  it('con datos vacíos rechaza con el mismo mensaje y sin intentar autenticar', async () => {
    const autenticar = vi.fn()
    expect(await ingresar('', 'clave', autenticar)).toEqual({
      aceptado: false,
      error: MENSAJE_DE_INGRESO_RECHAZADO,
    })
    expect(await ingresar('a@jjmm.pe', null, autenticar)).toEqual({
      aceptado: false,
      error: MENSAJE_DE_INGRESO_RECHAZADO,
    })
    expect(autenticar).not.toHaveBeenCalled()
  })

  it('un error inesperado (base caída) se propaga: no se disfraza de contraseña errónea', async () => {
    const autenticar = vi.fn().mockRejectedValue(new Error('conexión rechazada'))
    await expect(ingresar('a@jjmm.pe', 'clave', autenticar)).rejects.toThrow('conexión rechazada')
  })
})
