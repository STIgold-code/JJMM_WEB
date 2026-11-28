import type { CollectionBeforeDeleteHook } from 'payload'

// Al borrar una fila de la tabla (característica) se borran antes sus celdas en todos los
// planes. La llave foránea de `inclusiones-de-plan` deja la característica en nulo (ON DELETE SET
// NULL), así que sin este paso quedarían celdas huérfanas. Usa la misma petición (`req`): corre
// dentro de la transacción del borrado y, si falla, la fila tampoco se borra. Vale para el panel
// propio y para el /admin.
export class InclusionesDeLaFilaSinBorrarError extends Error {
  constructor(caracteristica: number | string) {
    super(`No se pudieron borrar las celdas de la fila ${String(caracteristica)} de la tabla.`)
    this.name = 'InclusionesDeLaFilaSinBorrarError'
  }
}

export const borrarInclusionesDeLaCaracteristica: CollectionBeforeDeleteHook = async ({
  id,
  req,
}) => {
  // El borrado por condición no lanza: devuelve los errores aparte. Se convierten en una
  // excepción para que la transacción se deshaga entera.
  const { errors } = await req.payload.delete({
    collection: 'inclusiones-de-plan',
    where: { caracteristica: { equals: id } },
    depth: 0,
    req,
  })
  if (errors.length > 0) throw new InclusionesDeLaFilaSinBorrarError(id)
}
