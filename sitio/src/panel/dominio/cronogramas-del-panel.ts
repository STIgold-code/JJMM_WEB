import type { FechaPorDigito } from '@/modulos/vencimientos/dominio/cronograma-sunat'

import { rangoDeFechas } from './fechas-de-cronograma'
import type { Aviso } from './respuesta-al-mensaje'

// Cronograma de SUNAT de un periodo tributario (el mes que se declara): una fecha por cada
// último dígito del RUC. Las fechas son días de Lima (AAAA-MM-DD).
export interface CronogramaDelPanel {
  id: number
  anio: number
  mes: number
  // «Enero 2026».
  periodo: string
  fechas: FechaPorDigito[]
  buenosContribuyentes: string | null
}

export const DIGITOS_DEL_RUC = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

// Lo que se escribe en el panel lateral: el año y el mes como texto (como los campos) y una fecha
// por dígito, en la posición de su dígito (vacía si falta).
export interface FormularioDeCronograma {
  anio: string
  mes: string
  fechas: string[]
  buenosContribuyentes: string
}

export function formularioDeCronograma(
  cronograma: CronogramaDelPanel | null,
  anioActual: number,
): FormularioDeCronograma {
  const fechaDe = (digito: number) =>
    cronograma?.fechas.find((fila) => fila.digito === digito)?.fecha ?? ''
  return {
    anio: String(cronograma?.anio ?? anioActual),
    mes: cronograma ? String(cronograma.mes) : '',
    fechas: DIGITOS_DEL_RUC.map(fechaDe),
    buenosContribuyentes: cronograma?.buenosContribuyentes ?? '',
  }
}

export function hayCambiosEnElCronograma(
  original: FormularioDeCronograma,
  actual: FormularioDeCronograma,
): boolean {
  const { fechas, ...resto } = original
  const camposDistintos = (Object.keys(resto) as (keyof typeof resto)[]).some(
    (campo) => resto[campo] !== actual[campo],
  )
  return camposDistintos || fechas.some((fecha, indice) => fecha !== actual.fechas[indice])
}

// Un cronograma cargado desde el /admin puede estar incompleto; la guía no lo muestra.
export function digitosQueFaltan(fechas: readonly FechaPorDigito[]): number[] {
  return DIGITOS_DEL_RUC.filter((digito) => !fechas.some((fila) => fila.digito === digito))
}

export function secundarioDeCronograma(cronograma: Pick<CronogramaDelPanel, 'fechas'>): string {
  return rangoDeFechas(cronograma.fechas.map((fila) => fila.fecha))
}

export function avisoDeCronogramaGuardado(periodo: string, nuevo: boolean): Aviso {
  return {
    titulo: nuevo ? `Cronograma de ${periodo} cargado` : 'Cambios guardados',
    detalle: 'Tus clientes ya pueden consultar su fecha con el RUC en la guía.',
  }
}

export function avisoDeCronogramaEliminado(periodo: string): Aviso {
  return { titulo: 'Cronograma eliminado', detalle: `Se borró el de ${periodo}.` }
}
