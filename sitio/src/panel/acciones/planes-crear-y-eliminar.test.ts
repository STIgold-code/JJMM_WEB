import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_SIN_PERMISO } from '../aplicacion/gestionar-mensajes'
import { ESTADO_INICIAL_DE_CREACION } from '../aplicacion/guardar-plan'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  nadaSeEscribio,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Crear y eliminar planes con la guardia y el adaptador reales (solo Next y Payload son dobles).
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

const { crearElPlan, eliminarElPlan } = await import('./planes')

const conNombre = (nombre: string) => {
  const datos = new FormData()
  datos.set('nombre', nombre)
  return datos
}

beforeEach(() => {
  reiniciarDobles({
    planes: [
      { id: 1, nombre: 'Emprende', orden: 0 },
      { id: 2, nombre: 'SIGEMype I', orden: 4 },
    ],
  })
  dobles.create.mockResolvedValue({ id: 9, nombre: 'SIGEMype III' })
  dobles.delete.mockResolvedValue({ id: 1, nombre: 'Emprende' })
})

describe('eliminarElPlan', () => {
  it('un editor no puede eliminar: no llega a Payload', async () => {
    conSesion(EDITOR)
    expect(await eliminarElPlan(1)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    nadaSeEscribio()
  })

  it('el administrador elimina con los permisos de la sesión y revalida', async () => {
    conSesion(ADMINISTRADOR)
    expect(await eliminarElPlan('1')).toEqual({
      ok: true,
      aviso: { titulo: 'Plan eliminado', detalle: 'Se borró Emprende con todo lo que incluía.' },
    })
    expect(dobles.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'planes',
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
    expect(await eliminarElPlan(1)).toEqual({ ok: false, error: ERROR_SIN_PERMISO })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('crearElPlan', () => {
  it('crea el plan oculto y al final de la tabla, con los permisos de la sesión', async () => {
    conSesion(EDITOR)
    const estado = await crearElPlan(ESTADO_INICIAL_DE_CREACION, conNombre(' SIGEMype III '))
    expect(estado).toEqual(expect.objectContaining({ estado: 'creado', id: 9 }))
    expect(dobles.create).toHaveBeenCalledWith(
      expect.objectContaining({
        collection: 'planes',
        data: { nombre: 'SIGEMype III', orden: 5, activo: false },
        overrideAccess: false,
        user: EDITOR,
      }),
    )
    expect(dobles.revalidatePath).toHaveBeenCalledWith('/panel', 'layout')
  })

  it.each(['Plan S/ 99', '   '])('el nombre «%s» no llega a Payload', async (nombre) => {
    conSesion(EDITOR)
    const estado = await crearElPlan(ESTADO_INICIAL_DE_CREACION, conNombre(nombre))
    expect(estado.estado).toBe('invalido')
    nadaSeEscribio()
  })
})
