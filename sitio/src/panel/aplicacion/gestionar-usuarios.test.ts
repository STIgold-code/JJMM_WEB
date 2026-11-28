import { describe, expect, it, vi } from 'vitest'

import {
  ERROR_DEGRADAR_AL_ULTIMO,
  ERROR_ELIMINAR_AL_ULTIMO,
  ERROR_ELIMINAR_TU_CUENTA,
} from '../dominio/reglas-de-administradores'
import type { UsuarioDelPanel } from '../dominio/usuarios'
import {
  ERROR_DE_CUENTA_INEXISTENTE,
  eliminarUsuario,
  obtenerUsuarios,
  type RepositorioDeUsuarios,
} from './gestionar-usuarios'
import { crearUsuario, ERROR_TU_PROPIA_CUENTA, guardarUsuario } from './guardar-usuario'

const CUENTAS: UsuarioDelPanel[] = [
  { id: 2, nombre: 'Zoila', correo: 'z@jjmm.pe', rol: 'editor' },
  { id: 1, nombre: 'Ana', correo: 'a@jjmm.pe', rol: 'administrador' },
]

function repositorio(cuentas = CUENTAS) {
  type Repo = RepositorioDeUsuarios
  return {
    listar: vi.fn<Repo['listar']>(async () => cuentas),
    crear: vi.fn<Repo['crear']>(async () => ({ estado: 'hecho', id: 9 })),
    guardar: vi.fn<Repo['guardar']>(async () => ({ estado: 'hecho' })),
    eliminar: vi.fn<Repo['eliminar']>(async () => ({ estado: 'hecho', nombre: 'Zoila' })),
  } satisfies RepositorioDeUsuarios
}

const FORMULARIO = { nombre: 'Zoila', correo: 'z@jjmm.pe', rol: 'editor', clave: '' }

describe('obtenerUsuarios', () => {
  it('devuelve las cuentas ordenadas por nombre', async () => {
    expect((await obtenerUsuarios(repositorio())).map((u) => u.id)).toEqual([1, 2])
  })
})

describe('eliminarUsuario', () => {
  it('elimina otra cuenta y avisa', async () => {
    const repo = repositorio()
    expect(await eliminarUsuario(repo, { id: '2', actor: 1 })).toEqual({
      ok: true,
      aviso: { titulo: 'Cuenta eliminada', detalle: 'Zoila ya no puede entrar al panel.' },
    })
    expect(repo.eliminar).toHaveBeenCalledWith(2)
  })

  it.each([
    ['la propia cuenta', 1, 1, ERROR_ELIMINAR_TU_CUENTA],
    ['el último administrador', 1, 7, ERROR_ELIMINAR_AL_ULTIMO],
    ['una cuenta que no existe', 5, 1, ERROR_DE_CUENTA_INEXISTENTE],
  ])('no elimina %s', async (_caso, id, actor, error) => {
    const repo = repositorio()
    expect(await eliminarUsuario(repo, { id, actor })).toEqual({ ok: false, error })
    expect(repo.eliminar).not.toHaveBeenCalled()
  })
})

describe('guardarUsuario', () => {
  it('la propia cuenta no se edita aquí', async () => {
    const repo = repositorio()
    const formulario = { ...FORMULARIO, rol: 'administrador' }
    expect(await guardarUsuario(repo, { id: 1, formulario, actor: 1 })).toEqual({
      estado: 'error',
      error: ERROR_TU_PROPIA_CUENTA,
    })
    expect(repo.guardar).not.toHaveBeenCalled()
  })

  it('no pasa a editor al último administrador', async () => {
    const repo = repositorio()
    expect(await guardarUsuario(repo, { id: 1, formulario: FORMULARIO, actor: 7 })).toEqual({
      estado: 'invalido',
      errores: { rol: ERROR_DEGRADAR_AL_ULTIMO },
    })
    expect(repo.guardar).not.toHaveBeenCalled()
  })

  it('sin contraseña nueva, guarda sin tocarla', async () => {
    const repo = repositorio()
    expect((await guardarUsuario(repo, { id: 2, formulario: FORMULARIO, actor: 1 })).estado).toBe(
      'guardado',
    )
    expect(repo.guardar).toHaveBeenCalledWith(2, {
      nombre: 'Zoila',
      correo: 'z@jjmm.pe',
      rol: 'editor',
      clave: null,
    })
  })
})

describe('crearUsuario', () => {
  it('un correo repetido (400 en `email`) vuelve como error del campo', async () => {
    const repo = repositorio()
    repo.crear.mockResolvedValueOnce({ estado: 'invalido', campos: ['email'] })
    const estado = await crearUsuario(repo, { ...FORMULARIO, clave: 'clave larga 1' })
    expect(estado).toEqual({
      estado: 'invalido',
      errores: { correo: 'Ya existe una cuenta con ese correo.' },
    })
  })
})
