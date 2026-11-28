import type { CollectionBeforeDeleteHook } from 'payload'

// Al borrar un plan se borran antes sus celdas de «Qué incluye». La llave foránea de
// `inclusiones-de-plan` deja el plan en nulo (ON DELETE SET NULL), así que sin este paso
// quedarían celdas huérfanas. Usa la misma petición (`req`): corre dentro de la transacción del
// borrado y, si falla, el plan tampoco se borra. Vale para el panel propio y para el /admin.
export class InclusionesSinBorrarError extends Error {
  constructor(plan: number | string) {
    super(`No se pudieron borrar las celdas de «Qué incluye» del plan ${String(plan)}.`)
    this.name = 'InclusionesSinBorrarError'
  }
}

export const borrarInclusionesDelPlan: CollectionBeforeDeleteHook = async ({ id, req }) => {
  // El borrado por condición no lanza: devuelve los errores aparte. Se convierten en una
  // excepción para que la transacción se deshaga entera.
  const { errors } = await req.payload.delete({
    collection: 'inclusiones-de-plan',
    where: { plan: { equals: id } },
    depth: 0,
    req,
  })
  if (errors.length > 0) throw new InclusionesSinBorrarError(id)
}
