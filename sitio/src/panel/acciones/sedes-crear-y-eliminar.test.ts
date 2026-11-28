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

// Crear y eliminar sedes con la guardia y el adaptador reales (solo Next y Payload son dobles).
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

const { crearLaSede, eliminarLaSede } = await import('./sedes')

const FORMULARIO = {
  nombre: ' Sede Lima Norte ',
  direccion: 'Av. Ejemplo 123',
  distrito: 'Los Olivos',
  ciudad: 'Lima',
  celulares: [{ clave: 1, numero: '951965242', tieneWhatsApp: true }],
  correo: '',
  mapa: '',
  visible: false,
}

beforeEach(() => {
  reiniciarDobles({
    sedes: [
      { id: 1, nombre: 'Sede San Martín de Porres', orden: 0 },
      { id: 2, nombre: 'Sede San Isidro', orden: 4 },
    ],
  })
  dobles.create.mockResolvedValue({ id: 9, nombre: 'Sede Lima Norte' })
  dobles.delete.mockResolvedValue({ id: 1, nombre: 'Sede San Martín de Porres' })
})

describe('eliminarLaSede', () => {
  it('un editor no puede eliminar: no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await eliminarLaSede(1)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    nadaSeEscribio()
  })

  it('el administrador elimina con los permisos de la sesión y revalida', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarLaSede('1')).toEqual({
      ok: true,
      aviso: { titulo: 'Sede eliminada', detalle: 'Se borró Sede San Martín de Porres.' },
    })
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'sedes',
        id: 1,
        overrideAccess: false,
        user: ADMINISTRADOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('si la colección lo rechaza (403), avisa sin permiso en vez de romperse', async () => {
    conSesion(ADMINISTRADOR)
    dobles.delete.mockRejectedValueOnce(Object.assign(new Error('Forbidden'), { status: 403 }))
    expect(await eliminarLaSede(1)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('un id inválido no llega a Payload', async () => {
    conSesion(ADMINISTRADOR)
    expect((await eliminarLaSede({ id: 1 })).ok).toBe(false)
    nadaSeEscribio()
  })
})

describe('crearLaSede', () => {
  it('crea la sede al final de la lista, con los permisos de la sesión', async () => {
    conSesion(EDITOR)
    const estado = await crearLaSede(FORMULARIO)
    expect(estado).toEqual(expect.objectContaining({ estado: 'creado', id: 9 }))
    expect(dobles.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'sedes',
        data: expect.objectContaining({ nombre: 'Sede Lima Norte', orden: 5, activo: false }),
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it('un formulario incompleto no llega a Payload', async () => {
    conSesion(EDITOR)
    const estado = await crearLaSede({ ...FORMULARIO, celulares: [] })
    expect(estado.estado).toBe('invalido')
    nadaSeEscribio()
  })
})
