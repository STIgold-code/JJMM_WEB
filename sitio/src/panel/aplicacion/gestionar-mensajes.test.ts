import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  cambiarEstadoDeMensaje,
  ERROR_DE_DATOS_GUARDADOS,
  ERROR_DE_MENSAJE_INEXISTENTE,
  ERROR_SIN_PERMISO,
  eliminarMensaje,
  type RepositorioDeEscrituraDeMensajes,
} from './gestionar-mensajes'

const repo = {
  actualizar: vi.fn<RepositorioDeEscrituraDeMensajes['actualizar']>(),
  eliminar: vi.fn<RepositorioDeEscrituraDeMensajes['eliminar']>(),
}

beforeEach(() => {
  repo.actualizar.mockReset().mockResolvedValue({ estado: 'hecho', nombre: 'Ana' })
  repo.eliminar.mockReset().mockResolvedValue({ estado: 'hecho', nombre: 'Ana' })
})

describe('cambiarEstadoDeMensaje', () => {
  it('cambia solo el estado y devuelve el aviso', async () => {
    const resultado = await cambiarEstadoDeMensaje(repo, { id: '3', estado: 'atendido' })
    expect(repo.actualizar).toHaveBeenCalledWith(3, { estado: 'atendido' })
    expect(resultado).toEqual({
      ok: true,
      aviso: {
        titulo: 'Mensaje de Ana atendido',
        detalle: 'Ya no cuenta como pendiente en el inicio.',
      },
    })
  })

  it('no escribe con un id o un estado inválidos', async () => {
    expect((await cambiarEstadoDeMensaje(repo, { id: 'x', estado: 'nuevo' })).ok).toBe(false)
    expect((await cambiarEstadoDeMensaje(repo, { id: 3, estado: 'borrado' })).ok).toBe(false)
    expect(repo.actualizar).not.toHaveBeenCalled()
  })

  it('traduce «no existe» y «sin permiso» a mensajes claros', async () => {
    repo.actualizar.mockResolvedValueOnce({ estado: 'no-encontrado' })
    expect(await cambiarEstadoDeMensaje(repo, { id: 3, estado: 'nuevo' })).toEqual({
      ok: false,
      error: ERROR_DE_MENSAJE_INEXISTENTE,
    })
    repo.actualizar.mockResolvedValueOnce({ estado: 'prohibido' })
    expect(await cambiarEstadoDeMensaje(repo, { id: 3, estado: 'nuevo' })).toEqual({
      ok: false,
      error: ERROR_SIN_PERMISO,
    })
  })
})

describe('cambiarEstadoDeMensaje con datos que la colección ya no acepta', () => {
  it('avisa que hay datos de contacto por corregir, sin lanzar', async () => {
    repo.actualizar.mockResolvedValueOnce({ estado: 'invalido', campos: ['correo'] })
    expect(await cambiarEstadoDeMensaje(repo, { id: 3, estado: 'atendido' })).toEqual({
      ok: false,
      error: ERROR_DE_DATOS_GUARDADOS,
    })
  })
})

describe('eliminarMensaje', () => {
  it('un editor no puede eliminar: no llega al repositorio', async () => {
    expect(await eliminarMensaje(repo, { id: 3, rol: 'editor' })).toEqual({
      ok: false,
      error: ERROR_SIN_PERMISO,
    })
    expect(repo.eliminar).not.toHaveBeenCalled()
  })

  it('el administrador elimina y recibe el aviso', async () => {
    expect(await eliminarMensaje(repo, { id: '3', rol: 'administrador' })).toEqual({
      ok: true,
      aviso: { titulo: 'Mensaje de Ana eliminado' },
    })
    expect(repo.eliminar).toHaveBeenCalledWith(3)
  })

  it('no elimina con un id inválido', async () => {
    expect((await eliminarMensaje(repo, { id: '-1', rol: 'administrador' })).ok).toBe(false)
    expect(repo.eliminar).not.toHaveBeenCalled()
  })
})
