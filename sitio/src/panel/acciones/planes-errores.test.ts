import { beforeEach, describe, expect, it, vi } from 'vitest'

import { ERROR_DE_DATOS_DEL_PLAN } from '../aplicacion/gestionar-planes'
import { ESTADO_INICIAL_DE_CREACION } from '../aplicacion/guardar-plan'
import { ERROR_NOMBRE_REPETIDO } from '../dominio/formulario-de-plan'
import {
  ADMINISTRADOR,
  conSesion,
  dobles,
  EDITOR,
  reiniciarDobles,
} from './prueba/dobles-de-payload'

// Errores de Payload al escribir, con la guardia y el adaptador reales (solo Next y la Local
// API son dobles): un 400 (datos rechazados por la colección) vuelve como resultado tipado y
// nunca rompe la pantalla; cualquier otro error se propaga tal cual.
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

const { cambiarVisibilidadDelPlan, crearElPlan, eliminarElPlan, ordenarLosPlanes } =
  await import('./planes')

beforeEach(() => {
  reiniciarDobles({
    planes: [
      { id: 1, nombre: 'Emprende', orden: 0 },
      { id: 2, nombre: 'SIGEMype I', orden: 1 },
    ],
  })
  conSesion(EDITOR)
})

describe('cuando Payload rechaza los datos (400)', () => {
  it('cambiarVisibilidadDelPlan devuelve un aviso claro, sin lanzar ni revalidar', async () => {
    dobles.update.mockRejectedValueOnce({ status: 400 })
    expect(await cambiarVisibilidadDelPlan(1, true)).toEqual({
      ok: false,
      error: ERROR_DE_DATOS_DEL_PLAN,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('ordenarLosPlanes deshace la transacción y devuelve un aviso claro', async () => {
    dobles.update.mockResolvedValueOnce({ id: 2 }).mockRejectedValueOnce({ status: 400 })
    expect(await ordenarLosPlanes([2, 1])).toEqual({ ok: false, error: ERROR_DE_DATOS_DEL_PLAN })
    expect(dobles.rollbackTransaction).toHaveBeenCalledWith('tx-1')
    expect(dobles.commitTransaction).not.toHaveBeenCalled()
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })

  it('crearElPlan con un nombre repetido devuelve el error del campo', async () => {
    dobles.create.mockRejectedValueOnce({ status: 400, data: { errors: [{ path: 'nombre' }] } })
    const datos = new FormData()
    datos.set('nombre', 'Emprende')
    expect(await crearElPlan(ESTADO_INICIAL_DE_CREACION, datos)).toEqual({
      estado: 'invalido',
      error: ERROR_NOMBRE_REPETIDO,
    })
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})

describe('cualquier otro error de Payload', () => {
  it('se propaga (por ejemplo, la base caída): nunca se muestra como un dato inválido', async () => {
    const caida = Object.assign(new Error('conexión rechazada'), { status: 500 })
    dobles.update.mockRejectedValueOnce(caida)
    await expect(cambiarVisibilidadDelPlan(1, true)).rejects.toBe(caida)
    dobles.create.mockRejectedValueOnce(new Error('sin conexión'))
    const datos = new FormData()
    datos.set('nombre', 'Nuevo')
    await expect(crearElPlan(ESTADO_INICIAL_DE_CREACION, datos)).rejects.toThrow('sin conexión')
    conSesion(ADMINISTRADOR)
    dobles.delete.mockRejectedValueOnce(new Error('sin conexión'))
    await expect(eliminarElPlan(1)).rejects.toThrow('sin conexión')
    expect(dobles.revalidatePath).not.toHaveBeenCalled()
  })
})
