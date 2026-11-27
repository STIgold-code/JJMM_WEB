import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_CELULAR, ERROR_DE_CORREO } from '../dominio/respuesta-al-mensaje'
import {
  ERROR_DE_DATOS_GUARDADOS,
  ERROR_DE_MENSAJE_INEXISTENTE,
  type RepositorioDeEscrituraDeMensajes,
} from './gestionar-mensajes'
import { guardarDatosDeContacto } from './guardar-datos-de-contacto'

const repo = {
  actualizar: vi.fn<RepositorioDeEscrituraDeMensajes['actualizar']>(),
  eliminar: vi.fn<RepositorioDeEscrituraDeMensajes['eliminar']>(),
}

beforeEach(() => {
  repo.actualizar.mockReset().mockResolvedValue({ estado: 'hecho', nombre: 'Ana' })
})

describe('guardarDatosDeContacto', () => {
  it('guarda solo celular y correo, ya normalizados', async () => {
    const resultado = await guardarDatosDeContacto(repo, {
      id: '8',
      celular: '951965242',
      correo: 'ana@correo.pe',
    })
    expect(repo.actualizar).toHaveBeenCalledWith(8, {
      celular: '951 965 242',
      correo: 'ana@correo.pe',
    })
    expect(resultado).toEqual({
      estado: 'guardado',
      aviso: { titulo: 'Datos de contacto guardados' },
      datos: { celular: '951 965 242', correo: 'ana@correo.pe' },
    })
  })

  it('con datos inválidos no escribe y devuelve el error del campo', async () => {
    const resultado = await guardarDatosDeContacto(repo, {
      id: 8,
      celular: '014567890',
      correo: '',
    })
    expect(resultado).toEqual({ estado: 'invalido', errores: { celular: ERROR_DE_CELULAR } })
    expect(repo.actualizar).not.toHaveBeenCalled()
  })

  it('si la colección rechaza un campo, lo muestra como error de ese campo', async () => {
    repo.actualizar.mockResolvedValueOnce({ estado: 'invalido', campos: ['correo'] })
    const resultado = await guardarDatosDeContacto(repo, {
      id: 8,
      celular: '',
      correo: 'ana@correo.pe',
    })
    expect(resultado).toEqual({ estado: 'invalido', errores: { correo: ERROR_DE_CORREO } })
  })

  it('si la colección rechaza otro campo, da un aviso general', async () => {
    repo.actualizar.mockResolvedValueOnce({ estado: 'invalido', campos: ['nombre'] })
    const resultado = await guardarDatosDeContacto(repo, { id: 8, celular: '', correo: '' })
    expect(resultado).toEqual({ estado: 'error', error: ERROR_DE_DATOS_GUARDADOS })
  })

  it('con un id inválido no escribe', async () => {
    const resultado = await guardarDatosDeContacto(repo, { id: null, celular: '', correo: '' })
    expect(resultado).toEqual({ estado: 'error', error: ERROR_DE_MENSAJE_INEXISTENTE })
    expect(repo.actualizar).not.toHaveBeenCalled()
  })
})
