import type { Rol } from '@/compartido/dominio/roles'
import type { TipoDeInclusion } from '@/modulos/planes/dominio/inclusion-de-plan'

import { RUTA_DEL_INICIO } from './rutas-del-panel'

// Planes en el panel: columnas de la tabla «Nuestros planes» del inicio, con su orden, su
// interruptor «Visible» y sus celdas de «Qué incluye» (una por característica).
export const RUTA_DE_PLANES = `${RUTA_DEL_INICIO}/planes`

export function rutaDelPlan(id: number): string {
  return `${RUTA_DE_PLANES}/${id}`
}

export interface PlanDelPanel {
  id: number
  nombre: string
  mensajeDeConsulta: string | null
  visible: boolean
  orden: number
}

export interface CaracteristicaDelPanel {
  id: number
  nombre: string
}

export interface InclusionDelPanel {
  id: number
  plan: number
  caracteristica: number
  tipo: TipoDeInclusion
  texto: string | null
}

// Lo que el sitio muestra como incluido: «Incluido» o un texto no vacío («Consultar»).
export function celdaIncluida({ tipo, texto }: Pick<InclusionDelPanel, 'tipo' | 'texto'>): boolean {
  if (tipo === 'incluido') return true
  return tipo === 'texto' && (texto?.trim() ?? '') !== ''
}

export function cuantasIncluye(plan: number, inclusiones: readonly InclusionDelPanel[]): number {
  return inclusiones.filter((i) => i.plan === plan && celdaIncluida(i)).length
}

// Dato secundario de la fila del listado.
export function resumenDeInclusiones(incluidas: number, caracteristicas: number): string {
  if (caracteristicas === 0) return 'La tabla todavía no tiene características'
  return `Incluye ${incluidas} de ${caracteristicas} características`
}

// Igual que los mensajes (L4 e): solo el administrador borra. La colección deja borrar al
// equipo, así que esta regla decide si el botón se muestra y la acción lo rechaza antes.
export function puedeEliminarPlanes(rol: Rol): boolean {
  return rol === 'administrador'
}
