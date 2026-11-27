import { ultimoDigitoDelRuc } from './ruc'

// Cronograma de SUNAT de un periodo: una fecha de vencimiento por cada último dígito del RUC.
export interface FechaPorDigito {
  digito: number
  // Fecha ISO (AAAA-MM-DD).
  fecha: string
}

const DIGITOS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] as const

export const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
] as const

// Nombre del periodo tributario (el mes que se declara), por ejemplo «Enero 2026».
export function nombreDelPeriodo(anio: number, mes: number): string {
  const nombreDelMes = MESES[mes - 1]
  if (!Number.isInteger(mes) || nombreDelMes === undefined) {
    throw new Error(`El mes ${mes} no existe: usa del 1 al 12.`)
  }
  return `${nombreDelMes} ${anio}`
}

export function validarFechasPorDigito(fechas: readonly FechaPorDigito[]): string | null {
  const fueraDeRango = fechas.find((fila) => !DIGITOS.some((digito) => digito === fila.digito))
  if (fueraDeRango) return `El dígito ${fueraDeRango.digito} no existe: usa del 0 al 9.`

  const repetido = DIGITOS.find((digito) => fechas.filter((f) => f.digito === digito).length > 1)
  if (repetido !== undefined) return `El dígito ${repetido} tiene más de una fecha.`

  const faltantes = DIGITOS.filter((digito) => !fechas.some((f) => f.digito === digito))
  if (faltantes.length > 0) return `Falta la fecha de los dígitos: ${faltantes.join(', ')}.`

  return null
}

export function fechaDeVencimientoParaRuc(fechas: readonly FechaPorDigito[], ruc: string): string {
  const digito = ultimoDigitoDelRuc(ruc)
  const fila = fechas.find((f) => f.digito === digito)
  if (!fila) throw new Error(`El cronograma no tiene la fecha del dígito ${digito}.`)
  return fila.fecha
}
