import {
  contieneMonto,
  MENSAJE_SIN_MONTOS,
  type TipoDeInclusion,
} from '@/modulos/planes/dominio/inclusion-de-plan'

import type { CaracteristicaDelPanel, InclusionDelPanel, PlanDelPanel } from './planes'
import type { ErroresDelPlan } from './validacion-de-plan'

// Formulario de edición de un plan: sus datos y una celda de «Qué incluye» por característica,
// en el orden de la tabla. Los textos se guardan tal como se escriben (el servidor los recorta).
export interface CeldaDelFormulario {
  caracteristica: number
  tipo: TipoDeInclusion
  // Se conserva al cambiar a «Incluido» para no perderlo si se vuelve a «Texto».
  texto: string
}

export interface FormularioDePlan {
  nombre: string
  mensajeDeConsulta: string
  visible: boolean
  celdas: CeldaDelFormulario[]
}

export const ERROR_NOMBRE_VACIO = 'Escribe el nombre del plan.'
export const ERROR_NOMBRE_REPETIDO = 'Ya existe otro plan con ese nombre.'
export const ERROR_DE_TABLA_CAMBIADA =
  'Las características de la tabla cambiaron mientras editabas. Recarga la página e inténtalo de nuevo.'

export function formularioDesdeGuardado(
  plan: PlanDelPanel,
  caracteristicas: readonly CaracteristicaDelPanel[],
  inclusiones: readonly InclusionDelPanel[],
): FormularioDePlan {
  const delPlan = new Map(
    inclusiones.filter((i) => i.plan === plan.id).map((i) => [i.caracteristica, i]),
  )
  return {
    nombre: plan.nombre,
    mensajeDeConsulta: plan.mensajeDeConsulta ?? '',
    visible: plan.visible,
    celdas: caracteristicas.map(({ id }) => {
      const guardada = delPlan.get(id)
      return {
        caracteristica: id,
        tipo: guardada?.tipo ?? 'no-incluido',
        texto: guardada?.texto ?? '',
      }
    }),
  }
}

export function cambiarCelda(
  formulario: FormularioDePlan,
  caracteristica: number,
  cambio: Partial<Pick<CeldaDelFormulario, 'tipo' | 'texto'>>,
): FormularioDePlan {
  return {
    ...formulario,
    celdas: formulario.celdas.map((celda) =>
      celda.caracteristica === caracteristica ? { ...celda, ...cambio } : celda,
    ),
  }
}

// Valor que se guardaría: el texto solo cuenta en una celda «Texto».
const claveDeCelda = ({ caracteristica, tipo, texto }: CeldaDelFormulario): string =>
  `${caracteristica}:${tipo}:${tipo === 'texto' ? texto.trim() : ''}`

const claveDelFormulario = (formulario: FormularioDePlan): string =>
  JSON.stringify([
    formulario.nombre.trim(),
    formulario.mensajeDeConsulta.trim(),
    formulario.visible,
    formulario.celdas.map(claveDeCelda),
  ])

// «Guardar cambios» se activa solo si lo que se guardaría difiere de lo guardado.
export function hayCambios(original: FormularioDePlan, actual: FormularioDePlan): boolean {
  return claveDelFormulario(original) !== claveDelFormulario(actual)
}

// Montos detectados mientras se escribe (S9), antes de guardar. El servidor vuelve a validar.
export function erroresEnVivo({ nombre, celdas }: FormularioDePlan): ErroresDelPlan {
  const conMonto = celdas.filter((c) => c.tipo === 'texto' && contieneMonto(c.texto))
  return {
    ...(contieneMonto(nombre) ? { nombre: MENSAJE_SIN_MONTOS } : {}),
    ...(conMonto.length > 0
      ? { celdas: Object.fromEntries(conMonto.map((c) => [c.caracteristica, MENSAJE_SIN_MONTOS])) }
      : {}),
  }
}

// Lo que dijo el servidor de un campo gana a lo detectado en vivo.
export function unirErrores(enVivo: ErroresDelPlan, servidor: ErroresDelPlan): ErroresDelPlan {
  const celdas = { ...enVivo.celdas, ...servidor.celdas }
  return {
    ...enVivo,
    ...servidor,
    ...(Object.keys(celdas).length > 0 ? { celdas } : {}),
  }
}
