import { describe, expect, it, vi } from 'vitest'

import { ERROR_CLAVES_DISTINTAS } from '../dominio/validacion-de-mi-cuenta'
import {
  cambiarMiClave,
  ERROR_AL_GUARDAR_LA_CUENTA,
  ERROR_CLAVE_ACTUAL_INCORRECTA,
  ERROR_CUENTA_BLOQUEADA,
  guardarMiNombre,
  type RepositorioDeMiCuenta,
  type VerificacionDeClave,
} from './mi-cuenta'

function repositorio(verificacion: VerificacionDeClave = 'correcta') {
  return {
    guardarNombre: vi.fn<RepositorioDeMiCuenta['guardarNombre']>(async () => ({ estado: 'hecho' })),
    verificarClave: vi.fn<RepositorioDeMiCuenta['verificarClave']>(async () => verificacion),
    cambiarClave: vi.fn<RepositorioDeMiCuenta['cambiarClave']>(async () => ({ estado: 'hecho' })),
  } satisfies RepositorioDeMiCuenta
}

const CAMBIO = {
  actual: 'clave de antes',
  nueva: 'clave nueva larga',
  repetida: 'clave nueva larga',
}

describe('guardarMiNombre', () => {
  it('guarda solo el nombre recortado', async () => {
    const repo = repositorio()
    const estado = await guardarMiNombre(repo, { nombre: ' Carmen ', rol: 'administrador' })
    expect(estado.estado).toBe('guardado')
    expect(repo.guardarNombre).toHaveBeenCalledWith('Carmen')
  })

  it('un rechazo de la colección es un aviso, no una excepción', async () => {
    const repo = repositorio()
    repo.guardarNombre.mockResolvedValueOnce({ estado: 'prohibido' })
    expect(await guardarMiNombre(repo, { nombre: 'Carmen' })).toEqual({
      estado: 'error',
      error: ERROR_AL_GUARDAR_LA_CUENTA,
    })
  })
})

describe('cambiarMiClave', () => {
  it('verifica la actual y luego guarda la nueva', async () => {
    const repo = repositorio()
    expect((await cambiarMiClave(repo, CAMBIO)).estado).toBe('cambiada')
    expect(repo.verificarClave).toHaveBeenCalledWith('clave de antes')
    expect(repo.cambiarClave).toHaveBeenCalledWith('clave nueva larga')
  })

  it('con la actual incorrecta no cambia nada y lo dice en su campo', async () => {
    const repo = repositorio('incorrecta')
    expect(await cambiarMiClave(repo, CAMBIO)).toEqual({
      estado: 'invalido',
      errores: { actual: ERROR_CLAVE_ACTUAL_INCORRECTA },
    })
    expect(repo.cambiarClave).not.toHaveBeenCalled()
  })

  it('con la cuenta bloqueada por intentos no cambia nada', async () => {
    const repo = repositorio('bloqueada')
    expect(await cambiarMiClave(repo, CAMBIO)).toEqual({
      estado: 'error',
      error: ERROR_CUENTA_BLOQUEADA,
    })
    expect(repo.cambiarClave).not.toHaveBeenCalled()
  })

  it('un formulario inválido no verifica ni escribe (no gasta un intento)', async () => {
    const repo = repositorio()
    expect(await cambiarMiClave(repo, { ...CAMBIO, repetida: 'otra cosa larga' })).toEqual({
      estado: 'invalido',
      errores: { repetida: ERROR_CLAVES_DISTINTAS },
    })
    expect(repo.verificarClave).not.toHaveBeenCalled()
    expect(repo.cambiarClave).not.toHaveBeenCalled()
  })
})
