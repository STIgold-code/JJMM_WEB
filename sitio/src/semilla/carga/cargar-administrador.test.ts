import { describe, expect, it } from 'vitest'

import { PuertoEnMemoria } from '../prueba/puerto-en-memoria'
import {
  cargarAdministrador,
  CredencialesIncompletasError,
  leerAdministrador,
} from './cargar-administrador'

const CREDENCIALES = { correo: 'admin@ejemplo.test', clave: 'clave-de-prueba' }

describe('leerAdministrador', () => {
  it('devuelve null si no hay variables: la carga no crea usuarios', () => {
    expect(leerAdministrador({})).toBeNull()
  })

  it('lee el correo y la clave del entorno', () => {
    expect(
      leerAdministrador({ SEMILLA_ADMIN_CORREO: ' admin@ejemplo.test ', SEMILLA_ADMIN_CLAVE: 'x' }),
    ).toEqual({ correo: 'admin@ejemplo.test', clave: 'x' })
  })

  it('falla si solo está una de las dos variables', () => {
    expect(() => leerAdministrador({ SEMILLA_ADMIN_CORREO: 'admin@ejemplo.test' })).toThrow(
      CredencialesIncompletasError,
    )
    expect(() => leerAdministrador({ SEMILLA_ADMIN_CLAVE: 'x' })).toThrow(
      CredencialesIncompletasError,
    )
  })
})

describe('cargarAdministrador', () => {
  it('crea la cuenta como administrador', async () => {
    const puerto = new PuertoEnMemoria()

    expect(await cargarAdministrador(puerto, CREDENCIALES)).toBe(true)
    expect(puerto.documentos('usuarios')[0]?.datos).toEqual({
      email: 'admin@ejemplo.test',
      password: 'clave-de-prueba',
      rol: 'administrador',
    })
  })

  it('no toca una cuenta que ya existe, así no cambia su contraseña', async () => {
    const puerto = new PuertoEnMemoria()
    await cargarAdministrador(puerto, CREDENCIALES)

    expect(await cargarAdministrador(puerto, { ...CREDENCIALES, clave: 'otra' })).toBe(false)
    expect(puerto.cantidad('usuarios')).toBe(1)
    expect(puerto.operaciones.filter((o) => o.destino === 'usuarios')).toHaveLength(1)
    expect(puerto.documentos('usuarios')[0]?.datos.password).toBe('clave-de-prueba')
  })

  it('sin credenciales no crea nada', async () => {
    const puerto = new PuertoEnMemoria()

    expect(await cargarAdministrador(puerto, null)).toBe(false)
    expect(puerto.cantidad('usuarios')).toBe(0)
  })
})
