import type { CaracteristicaSemilla, CeldaSemilla, PlanSemilla } from '../datos/tipos'
import { asegurar, type IdDeDocumento, type PuertoDeCarga } from '../puerto-de-carga'
import { cargarEnOrden } from './cargar-en-orden'

export class MatrizDePlanesIncompletaError extends Error {
  constructor(caracteristica: string) {
    super(`La característica «${caracteristica}» no tiene una celda por cada plan.`)
    this.name = 'MatrizDePlanesIncompletaError'
  }
}

const datosDeCelda = (celda: CeldaSemilla) =>
  typeof celda === 'string' ? { tipo: celda, texto: null } : { tipo: 'texto' as const, ...celda }

async function cargarFila(
  puerto: PuertoDeCarga,
  { nombre, celdas }: CaracteristicaSemilla,
  caracteristica: IdDeDocumento,
  planes: readonly IdDeDocumento[],
): Promise<void> {
  if (celdas.length !== planes.length) throw new MatrizDePlanesIncompletaError(nombre)
  for (const [indice, plan] of planes.entries()) {
    const celda = celdas[indice]
    if (celda === undefined) throw new MatrizDePlanesIncompletaError(nombre)
    const datos = { plan, caracteristica, ...datosDeCelda(celda) }
    await asegurar(puerto, 'inclusiones-de-plan', { plan, caracteristica }, datos)
  }
}

// Planes, características e inclusiones (S8: tres colecciones, sin JSON). Una inclusión por
// par plan + característica, que es también su clave natural.
export async function cargarPlanes(
  puerto: PuertoDeCarga,
  planes: readonly PlanSemilla[],
  caracteristicas: readonly CaracteristicaSemilla[],
): Promise<void> {
  const idsDePlanes = await cargarEnOrden(
    puerto,
    'planes',
    planes,
    (plan, orden) => ({ ...plan, orden }),
    (plan) => ({ nombre: plan.nombre }),
  )
  const idsDeCaracteristicas = await cargarEnOrden(
    puerto,
    'caracteristicas-de-plan',
    caracteristicas,
    ({ nombre }, orden) => ({ nombre, orden }),
    ({ nombre }) => ({ nombre }),
  )
  for (const [indice, fila] of caracteristicas.entries()) {
    const id = idsDeCaracteristicas[indice]
    if (id !== undefined) await cargarFila(puerto, fila, id, idsDePlanes)
  }
}
