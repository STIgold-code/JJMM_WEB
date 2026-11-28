import type { PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { coleccionCaracteristicasDePlan } from './coleccion-caracteristicas-de-plan'
import {
  borrarInclusionesDeLaCaracteristica,
  InclusionesDeLaFilaSinBorrarError,
} from './borrar-inclusiones-de-la-caracteristica'

// Petición mínima: el hook solo usa `req.payload.delete`. El doble se declara como
// `PayloadRequest` porque armar una petición real exige una instancia de Payload.
function peticion(errores: unknown[]) {
  const borrar = vi.fn().mockResolvedValue({ docs: [], errors: errores })
  const req = { payload: { delete: borrar } } as unknown as PayloadRequest
  return { req, borrar }
}

const ejecutar = (req: PayloadRequest) =>
  borrarInclusionesDeLaCaracteristica({
    id: 4,
    req,
    collection: {} as never,
    context: {},
  })

describe('borrarInclusionesDeLaCaracteristica', () => {
  it('borra solo las celdas de esa fila, dentro de la misma petición (misma transacción)', async () => {
    const { req, borrar } = peticion([])
    await ejecutar(req)
    expect(borrar).toHaveBeenCalledTimes(1)
    expect(borrar).toHaveBeenCalledWith({
      collection: 'inclusiones-de-plan',
      where: { caracteristica: { equals: 4 } },
      depth: 0,
      req,
    })
  })

  it('si alguna celda no se borra, lanza para que la fila tampoco se borre', async () => {
    const { req } = peticion([{ id: 3, message: 'falló' }])
    await expect(ejecutar(req)).rejects.toBeInstanceOf(InclusionesDeLaFilaSinBorrarError)
  })

  it('está registrado como beforeDelete de caracteristicas-de-plan', () => {
    expect(coleccionCaracteristicasDePlan.hooks?.beforeDelete).toContain(
      borrarInclusionesDeLaCaracteristica,
    )
  })
})
