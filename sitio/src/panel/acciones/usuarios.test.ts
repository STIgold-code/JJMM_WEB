import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Acciones de «Usuarios» por su interfaz pública, con la guardia `exigirAdministrador` y el
// adaptador reales: solo Next y la Local API de Payload son dobles (S4.3).
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

const { crearElUsuario, eliminarElUsuario, guardarElUsuario } = await import('./usuarios')

const OTRO_ADMINISTRADOR = { id: 3, rol: 'administrador', email: 'b@jjmm.pe', nombre: 'Beto' }
const USUARIOS = [ADMINISTRADOR, EDITOR, OTRO_ADMINISTRADOR]

const FORMULARIO = { nombre: 'Editora', correo: 'e@jjmm.pe', rol: 'editor', clave: '' }
const NUEVA = {
  nombre: 'Asistente',
  correo: 'Asis@JJMM.pe',
  rol: 'editor',
  clave: 'clave muy larga',
}

const ACCIONES = [
  ['crearElUsuario', () => crearElUsuario(NUEVA)],
  ['guardarElUsuario (editar otra cuenta)', () => guardarElUsuario(2, FORMULARIO)],
  [
    'guardarElUsuario (cambiar la contraseña de otra cuenta)',
    () => guardarElUsuario(3, { ...FORMULARIO, rol: 'administrador', clave: 'otra clave larga' }),
  ],
  ['eliminarElUsuario', () => eliminarElUsuario(3)],
] as const

beforeEach(() => {
  reiniciarDobles({ usuarios: USUARIOS })
  dobles.create.mockResolvedValue({ id: 9, nombre: 'Asistente', email: 'asis@jjmm.pe' })
  dobles.update.mockResolvedValue({ id: 2 })
  dobles.delete.mockResolvedValue(OTRO_ADMINISTRADOR)
})

describe('acciones de usuarios sin sesión (S4.3)', () => {
  it.each(ACCIONES)('%s lleva al ingreso y no lee ni escribe nada', async (_, accion) => {
    conSesion(null)
    await expect(accion()).rejects.toThrow('REDIRECCION /panel/ingreso')
    expect(dobles.find).not.toHaveBeenCalled()
    nadaSeEscribio()
  })
})

describe('acciones de usuarios con la sesión de un editor', () => {
  it.each(ACCIONES)('%s se rechaza sin leer ni escribir nada', async (_, accion) => {
    conSesion(EDITOR)
    const resultado = await accion()
    expect(resultado).toEqual(
      'ok' in resultado
        ? { ok: false, error: ERROR_SIN_PERMISO }
        : { estado: 'error', error: ERROR_SIN_PERMISO },
    )
    expect(dobles.find).not.toHaveBeenCalled()
    nadaSeEscribio()
  })
})

describe('con la sesión del administrador', () => {
  beforeEach(() => conSesion(ADMINISTRADOR))

  it('crearElUsuario escribe solo los campos de la colección, con sus permisos', async () => {
    expect((await crearElUsuario({ ...NUEVA, id: 1, hash: 'x' })).estado).toBe('guardado')
    expect(dobles.create).toHaveBeenCalledWith({
      collection: 'usuarios',
      data: { nombre: 'Asistente', email: 'asis@jjmm.pe', rol: 'editor', password: NUEVA.clave },
      overrideAccess: false,
      user: ADMINISTRADOR,
      depth: 0,
    })
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('guardarElUsuario sin contraseña nueva no envía `password`', async () => {
    expect((await guardarElUsuario('2', FORMULARIO)).estado).toBe('guardado')
    expect(dobles.update).toHaveBeenCalledWith({
      collection: 'usuarios',
      id: 2,
      data: { nombre: 'Editora', email: 'e@jjmm.pe', rol: 'editor' },
      overrideAccess: false,
      user: ADMINISTRADOR,
      depth: 0,
    })
  })

  it('guardarElUsuario con contraseña nueva la envía a Payload y no la devuelve', async () => {
    const formulario = { ...FORMULARIO, clave: 'otra clave larga' }
    const estado = await guardarElUsuario(2, formulario)
    expect(dobles.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ password: 'otra clave larga' }) }),
    )
    expect(JSON.stringify(estado)).not.toContain('otra clave larga')
  })

  it('eliminarElUsuario borra otra cuenta con sus permisos y revalida', async () => {
    expect(await eliminarElUsuario(3)).toEqual({
      ok: true,
      aviso: { titulo: 'Cuenta eliminada', detalle: 'Beto ya no puede entrar al panel.' },
    })
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({ collection: 'usuarios', id: 3, overrideAccess: false }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un id inválido no llega a Payload', async () => {
    expect((await eliminarElUsuario('3; DROP')).ok).toBe(false)
    expect((await guardarElUsuario({ id: 2 }, FORMULARIO)).estado).toBe('error')
    nadaSeEscribio()
  })
})
