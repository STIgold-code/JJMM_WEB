import { type FormularioDePlan, formularioDesdeGuardado } from '../dominio/formulario-de-plan'
import { leerId } from '../dominio/identificadores'
import {
  type CaracteristicaDelPanel,
  cuantasIncluye,
  type InclusionDelPanel,
  type PlanDelPanel,
} from '../dominio/planes'

// Textos de la sección «Nuestros planes» de la página de inicio, para la vista previa.
export interface TextosDeLaSeccion {
  titulo: string
  bajada: string | null
  encabezado: string
  textoDelBoton: string
  notaAlPie: string | null
}

// Lecturas con los permisos de quien entra. Planes y características, en el orden del sitio.
export interface RepositorioDeLecturaDePlanes {
  listarPlanes(): Promise<PlanDelPanel[]>
  listarCaracteristicas(): Promise<CaracteristicaDelPanel[]>
  listarInclusiones(): Promise<InclusionDelPanel[]>
  // `null` si la página de inicio no tiene la sección: la vista previa usa los textos de siempre.
  leerTextosDeLaSeccion(): Promise<TextosDeLaSeccion | null>
}

export interface PlanDelListado extends PlanDelPanel {
  incluidas: number
}

export interface DatosDelListadoDePlanes {
  planes: PlanDelListado[]
  caracteristicas: number
}

export interface DatosDeEdicionDePlan {
  plan: PlanDelPanel
  formulario: FormularioDePlan
  caracteristicas: CaracteristicaDelPanel[]
  planes: PlanDelPanel[]
  inclusiones: InclusionDelPanel[]
  textos: TextosDeLaSeccion
  // Filas de «Qué incluye» guardadas para este plan: el diálogo de borrado dice cuántas se van.
  celdasGuardadas: number
}

// Los valores con que se crea la sección (`bloque-planes.ts`).
export const TEXTOS_PREDETERMINADOS: TextosDeLaSeccion = {
  titulo: 'Nuestros planes',
  bajada: null,
  encabezado: 'Qué incluye',
  textoDelBoton: 'Solicitar',
  notaAlPie: null,
}

export async function obtenerListadoDePlanes(
  repositorio: RepositorioDeLecturaDePlanes,
): Promise<DatosDelListadoDePlanes> {
  const [planes, caracteristicas, inclusiones] = await Promise.all([
    repositorio.listarPlanes(),
    repositorio.listarCaracteristicas(),
    repositorio.listarInclusiones(),
  ])
  return {
    planes: planes.map((plan) => ({ ...plan, incluidas: cuantasIncluye(plan.id, inclusiones) })),
    caracteristicas: caracteristicas.length,
  }
}

// `null` si el id de la URL no es válido o el plan no existe (la página responde 404).
export async function obtenerEdicionDePlan(
  repositorio: RepositorioDeLecturaDePlanes,
  idEnLaUrl: unknown,
): Promise<DatosDeEdicionDePlan | null> {
  const id = leerId(idEnLaUrl)
  if (id === null) return null
  const [planes, caracteristicas, inclusiones, textos] = await Promise.all([
    repositorio.listarPlanes(),
    repositorio.listarCaracteristicas(),
    repositorio.listarInclusiones(),
    repositorio.leerTextosDeLaSeccion(),
  ])
  const plan = planes.find((p) => p.id === id)
  if (!plan) return null
  return {
    plan,
    formulario: formularioDesdeGuardado(plan, caracteristicas, inclusiones),
    caracteristicas,
    planes,
    inclusiones,
    textos: textos ?? TEXTOS_PREDETERMINADOS,
    celdasGuardadas: inclusiones.filter((i) => i.plan === id).length,
  }
}
