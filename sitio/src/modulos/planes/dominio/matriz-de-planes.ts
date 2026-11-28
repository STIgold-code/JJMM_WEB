import { contieneMonto, type TipoDeInclusion } from './inclusion-de-plan'

// Matriz «qué incluye cada plan» que arman las tres colecciones: plan, característica e
// inclusión (una fila por plan + característica).
export interface PlanGuardado {
  id: number
  nombre: string
  mensajeDeConsulta: string | null
  // Interruptor «Visible» del panel: un plan oculto no se publica, pero conserva sus datos.
  visible: boolean
}

export interface CaracteristicaGuardada {
  id: number
  nombre: string
}

export interface InclusionGuardada {
  plan: number
  caracteristica: number
  tipo: TipoDeInclusion
  texto: string | null
}

export type CeldaDePlan =
  { tipo: 'incluido' } | { tipo: 'no-incluido' } | { tipo: 'texto'; texto: string }

export interface FilaDePlanes {
  caracteristica: string
  celdas: CeldaDePlan[]
}

export interface MatrizDePlanes {
  planes: PlanGuardado[]
  filas: FilaDePlanes[]
}

// S9: un monto en una celda es un error de datos; no se oculta, se informa.
export class MontoNoPublicableError extends Error {
  constructor(texto: string) {
    super(`La celda «${texto}» publica un monto. Los precios se muestran como «Consultar».`)
    this.name = 'MontoNoPublicableError'
  }
}

const NO_INCLUIDO: CeldaDePlan = { tipo: 'no-incluido' }

function aCelda(inclusion: InclusionGuardada | undefined): CeldaDePlan {
  if (!inclusion || inclusion.tipo === 'no-incluido') return NO_INCLUIDO
  if (inclusion.tipo === 'incluido') return { tipo: 'incluido' }
  const texto = inclusion.texto?.trim() ?? ''
  if (!texto) return NO_INCLUIDO
  if (contieneMonto(texto)) throw new MontoNoPublicableError(texto)
  return { tipo: 'texto', texto }
}

const claveDe = (plan: number, caracteristica: number) => `${plan}:${caracteristica}`

// Solo se publican los planes visibles. Lo que falte en la matriz se muestra como no incluido.
// Sin planes visibles o sin características no hay tabla que dibujar.
export function armarMatrizDePlanes(
  todos: readonly PlanGuardado[],
  caracteristicas: readonly CaracteristicaGuardada[],
  inclusiones: readonly InclusionGuardada[],
): MatrizDePlanes | null {
  const planes = todos.filter((plan) => plan.visible)
  if (planes.length === 0 || caracteristicas.length === 0) return null
  const porClave = new Map(inclusiones.map((i) => [claveDe(i.plan, i.caracteristica), i]))
  const filas = caracteristicas.map((caracteristica) => ({
    caracteristica: caracteristica.nombre,
    celdas: planes.map((plan) => aCelda(porClave.get(claveDe(plan.id, caracteristica.id)))),
  }))
  return { planes, filas }
}
