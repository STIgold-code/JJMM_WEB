import type { TipoDeInclusion } from '@/modulos/planes/dominio/inclusion-de-plan'
import type { CeldaDePlan } from '@/modulos/planes/dominio/matriz-de-planes'

import type { FormularioDePlan } from './formulario-de-plan'
import type { CaracteristicaDelPanel, InclusionDelPanel, PlanDelPanel } from './planes'

// Vista previa de «Nuestros planes» mientras se edita un plan: la tabla del sitio con lo
// guardado de los demás planes y lo que se está escribiendo en este, con las mismas reglas
// (solo planes visibles, en su orden; lo vacío se ve como no incluido). A diferencia del sitio,
// nunca lanza: un monto a medio escribir se marca en su campo, no rompe la vista.
export interface ColumnaDeVistaPrevia {
  nombre: string
  editado: boolean
}

export interface FilaDeVistaPrevia {
  caracteristica: string
  celdas: CeldaDePlan[]
}

export interface VistaPreviaDePlanes {
  columnas: ColumnaDeVistaPrevia[]
  filas: FilaDeVistaPrevia[]
  // El plan editado está oculto: no tiene columna en la tabla.
  planOculto: boolean
}

interface DatosDeVistaPrevia {
  planes: readonly PlanDelPanel[]
  caracteristicas: readonly CaracteristicaDelPanel[]
  inclusiones: readonly InclusionDelPanel[]
  idDelPlan: number
  formulario: FormularioDePlan
}

interface Valor {
  tipo: TipoDeInclusion
  texto: string | null
}

// Lo vacío o sin guardar se ve como no incluido, igual que en el sitio.
export function aCelda(valor: Valor | undefined): CeldaDePlan {
  const texto = valor?.texto?.trim() ?? ''
  if (valor?.tipo === 'incluido') return { tipo: 'incluido' }
  if (valor?.tipo === 'texto' && texto !== '') return { tipo: 'texto', texto }
  return { tipo: 'no-incluido' }
}

const clave = (plan: number, caracteristica: number) => `${plan}:${caracteristica}`

export function vistaPreviaDePlanes(datos: DatosDeVistaPrevia): VistaPreviaDePlanes {
  const { planes, caracteristicas, inclusiones, idDelPlan, formulario } = datos
  const visibles = planes.filter((p) => (p.id === idDelPlan ? formulario.visible : p.visible))
  const valores = new Map<string, Valor>(
    inclusiones.map((i) => [clave(i.plan, i.caracteristica), i]),
  )
  for (const celda of formulario.celdas) valores.set(clave(idDelPlan, celda.caracteristica), celda)
  return {
    columnas: visibles.map((p) =>
      p.id === idDelPlan
        ? { nombre: formulario.nombre.trim() || 'Sin nombre', editado: true }
        : { nombre: p.nombre, editado: false },
    ),
    filas: caracteristicas.map(({ id, nombre }) => ({
      caracteristica: nombre,
      celdas: visibles.map((p) => aCelda(valores.get(clave(p.id, id)))),
    })),
    planOculto: !formulario.visible,
  }
}
