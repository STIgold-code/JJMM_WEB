import type { PayloadRequest } from 'payload'
import { describe, expect, it, vi } from 'vitest'

import { borrarInclusionesDelPlan, InclusionesSinBorrarError } from './borrar-inclusiones-del-plan'

// Petición mínima: el hook solo usa `req.payload.delete`. El doble se declara como
// `PayloadRequest` porque armar una petición real exige una instancia de Payload.
function peticion(errores: unknown[]) {
  const borrar = vi.fn().mockResolvedValue({ docs: [], errors: errores })
  const req = { payload: { delete: borrar } } as unknown as PayloadRequest
  return { req, borrar }
}

const ejecutar = (req: PayloadRequest) =>
  borrarInclusionesDelPlan({
    id: 7,
    req,
    collection: {} as never,
    context: {},
  })

describe('borrarInclusionesDelPlan', () => {
  it('borra las celdas del plan dentro de la misma petición (misma transacción)', async () => {
    const { req, borrar } = peticion([])
    await ejecutar(req)
    expect(borrar).toHaveBeenCalledWith({
      collection: 'inclusiones-de-plan',
      where: { plan: { equals: 7 } },
      depth: 0,
      req,
    })
  })

  it('si alguna celda no se borra, lanza para que el plan tampoco se borre', async () => {
    const { req } = peticion([{ id: 3, message: 'falló' }])
    await expect(ejecutar(req)).rejects.toBeInstanceOf(InclusionesSinBorrarError)
  })
})
