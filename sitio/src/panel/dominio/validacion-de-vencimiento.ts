import type { Periodicidad } from '@/modulos/vencimientos/dominio/vencimiento'

import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'
import {
  LARGO_MAXIMO_CORTO,
  leerTexto,
  soloConError,
  textoDemasiadoLargo,
} from './guia-de-clientes'
import { SIN_FECHA_PUBLICADA } from './vencimientos-del-panel'

// Validación en el servidor del formulario de un vencimiento (`unknown`), con las reglas de la
// colección `vencimientos`: obligación, periodicidad (mensual o anual) y «Cuándo vence»
// obligatorios; la nota es opcional.
export interface VencimientoValidado {
  obligacion: string
  periodicidad: Periodicidad
  cuandoVence: string
  nota: string | null
}

export interface ErroresDeVencimiento {
  general?: string
  obligacion?: string
  cuandoVence?: string
  nota?: string
}

export type ValidacionDeVencimiento =
  { valido: true; datos: VencimientoValidado } | { valido: false; errores: ErroresDeVencimiento }

const LARGO_MAXIMO_DE_NOTA = 1000
const PERIODICIDADES: readonly Periodicidad[] = ['mensual', 'anual']

const esPeriodicidad = (valor: unknown): valor is Periodicidad =>
  PERIODICIDADES.some((periodicidad) => periodicidad === valor)

type Leido = Omit<VencimientoValidado, 'nota'> & { nota: string }

function leerFormulario(entrada: unknown): Leido | null {
  if (!esObjeto(entrada) || !esPeriodicidad(entrada.periodicidad)) return null
  const [obligacion, cuandoVence, nota] = [
    entrada.obligacion,
    entrada.cuandoVence,
    entrada.nota,
  ].map(leerTexto)
  if (obligacion == null || cuandoVence == null || nota == null) return null
  return { obligacion, periodicidad: entrada.periodicidad, cuandoVence, nota }
}

function errorObligatorio(texto: string, vacio: string): string | null {
  if (texto === '') return vacio
  return texto.length > LARGO_MAXIMO_CORTO ? textoDemasiadoLargo(LARGO_MAXIMO_CORTO) : null
}

const erroresDe = (leido: Leido): ErroresDeVencimiento =>
  soloConError({
    obligacion: errorObligatorio(leido.obligacion, 'Escribe la obligación.'),
    cuandoVence: errorObligatorio(
      leido.cuandoVence,
      `Escribe cuándo vence. Si no hay fecha, escribe «${SIN_FECHA_PUBLICADA}»`,
    ),
    nota:
      leido.nota.length > LARGO_MAXIMO_DE_NOTA ? textoDemasiadoLargo(LARGO_MAXIMO_DE_NOTA) : null,
  })

export function validarFormularioDeVencimiento(entrada: unknown): ValidacionDeVencimiento {
  const leido = leerFormulario(entrada)
  if (!leido) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const errores = erroresDe(leido)
  if (Object.keys(errores).length > 0) return { valido: false, errores }
  return { valido: true, datos: { ...leido, nota: leido.nota || null } }
}
