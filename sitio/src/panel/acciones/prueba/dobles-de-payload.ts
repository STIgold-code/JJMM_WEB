import { expect, vi } from 'vitest'

// Dobles de Next y de la Local API de Payload para probar las acciones (planes, sedes, usuarios,
// mi cuenta) con la guardia y el adaptador reales. Cada archivo de prueba registra los `vi.mock`
// (que se elevan) y toma estos dobles con una importación dinámica dentro de la fábrica.
export const dobles = {
  auth: vi.fn(),
  login: vi.fn(),
  find: vi.fn(),
  findByID: vi.fn(),
  findGlobal: vi.fn(),
  count: vi.fn(),
  update: vi.fn(),
  updateGlobal: vi.fn(),
  create: vi.fn(),
  delete: vi.fn(),
  beginTransaction: vi.fn(),
  commitTransaction: vi.fn(),
  rollbackTransaction: vi.fn(),
  revalidatePath: vi.fn(),
}

export const payloadDoble = {
  auth: dobles.auth,
  login: dobles.login,
  find: dobles.find,
  findByID: dobles.findByID,
  findGlobal: dobles.findGlobal,
  count: dobles.count,
  update: dobles.update,
  updateGlobal: dobles.updateGlobal,
  create: dobles.create,
  delete: dobles.delete,
  db: {
    beginTransaction: dobles.beginTransaction,
    commitTransaction: dobles.commitTransaction,
    rollbackTransaction: dobles.rollbackTransaction,
  },
}

export const ADMINISTRADOR = { id: 1, rol: 'administrador', email: 'a@jjmm.pe' }
export const EDITOR = { id: 2, rol: 'editor', email: 'e@jjmm.pe' }

export function conSesion(usuario: object | null): void {
  dobles.auth.mockResolvedValue({ user: usuario, permissions: { collections: {} } })
}

// Reinicia los dobles: cada `find` devuelve lo que `colecciones` tenga para su colección (y
// `count`, cuántos son), cada global sale vacía salvo que `globales` traiga una, y la base abre la
// transacción `tx-1`.
export function reiniciarDobles(
  colecciones: Readonly<Record<string, unknown[]>>,
  globales: Readonly<Record<string, object>> = {},
): void {
  for (const doble of Object.values(dobles)) doble.mockReset()
  dobles.find.mockImplementation(async ({ collection }: { collection: string }) => ({
    docs: colecciones[collection] ?? [],
  }))
  dobles.count.mockImplementation(async ({ collection }: { collection: string }) => ({
    totalDocs: colecciones[collection]?.length ?? 0,
  }))
  dobles.findGlobal.mockImplementation(async ({ slug }: { slug: string }) => globales[slug] ?? {})
  dobles.beginTransaction.mockResolvedValue('tx-1')
}

export function redireccionDePrueba(ruta: string): never {
  throw new Error(`REDIRECCION ${ruta}`)
}

// Ninguna escritura llegó a Payload y nada se revalidó. `login` cuenta como escritura: suma intentos
// fallidos y abre sesiones.
export function nadaSeEscribio(): void {
  const escrituras = [
    dobles.update,
    dobles.updateGlobal,
    dobles.create,
    dobles.delete,
    dobles.beginTransaction,
  ]
  for (const doble of [...escrituras, dobles.login]) expect(doble).not.toHaveBeenCalled()
  expect(dobles.revalidatePath).not.toHaveBeenCalled()
}
