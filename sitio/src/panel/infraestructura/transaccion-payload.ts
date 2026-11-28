import type { Payload, PayloadRequest } from 'payload'

// Varias escrituras de la Local API como una sola: todas o ninguna. Cada operación recibe la
// misma petición con el `transactionID` (así lo indica la documentación de transacciones de
// Payload); ninguna confirma por su cuenta porque la transacción ya existe. Si una falla, Payload
// la deshace y aquí se vuelve a pedir el rollback por si el error vino de fuera de una operación
// (el adaptador ignora un segundo rollback). Si la base no admite transacciones
// (`beginTransaction` devuelve `null`), las escrituras corren sin ella.
export type PeticionDeTransaccion = Partial<PayloadRequest>

export async function enTransaccion<T>(
  payload: Payload,
  trabajo: (req: PeticionDeTransaccion) => Promise<T>,
): Promise<T> {
  const id = await payload.db.beginTransaction()
  const req: PeticionDeTransaccion = id === null ? {} : { transactionID: id }
  try {
    const resultado = await trabajo(req)
    if (id !== null) await payload.db.commitTransaction(id)
    return resultado
  } catch (error) {
    if (id !== null) await payload.db.rollbackTransaction(id)
    throw error
  }
}
