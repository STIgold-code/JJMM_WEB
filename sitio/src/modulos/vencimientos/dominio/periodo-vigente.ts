import { type FechaPorDigito, validarFechasPorDigito } from './cronograma-sunat'

// Cronograma de SUNAT de un periodo tributario (el mes que se declara).
export interface CronogramaDelPeriodo {
  anio: number
  mes: number
  // Nombre del periodo, por ejemplo «Enero 2026».
  periodo: string
  fechas: FechaPorDigito[]
  // Fecha ISO para buenos contribuyentes y UESP, si SUNAT la publica.
  fechaBuenosContribuyentes: string | null
}

const DICIEMBRE = 12

export const claveDelPeriodo = (anio: number, mes: number): string =>
  `${anio}-${String(mes).padStart(2, '0')}`

const clave = (cronograma: CronogramaDelPeriodo) => claveDelPeriodo(cronograma.anio, cronograma.mes)

// Periodos que vencen durante el año: los del año y el diciembre anterior, que vence en
// enero. Del más antiguo al más reciente.
export function cronogramasDelAnio(
  cronogramas: readonly CronogramaDelPeriodo[],
  anio: number,
): CronogramaDelPeriodo[] {
  const esDelAnio = (c: CronogramaDelPeriodo) =>
    c.anio === anio || (c.anio === anio - 1 && c.mes === DICIEMBRE)
  return cronogramas.filter(esDelAnio).sort((a, b) => clave(a).localeCompare(clave(b)))
}

// Solo un cronograma con una fecha por cada dígito del RUC sirve para consultar.
export const esCronogramaCompleto = (cronograma: CronogramaDelPeriodo): boolean =>
  validarFechasPorDigito(cronograma.fechas) === null

const ultimaFecha = (cronograma: CronogramaDelPeriodo): string =>
  cronograma.fechas.reduce((ultima, { fecha }) => (fecha > ultima ? fecha : ultima), '')

// El primer periodo (en orden) que todavía tiene fechas por vencer a la fecha `hoy`
// (AAAA-MM-DD); si todos vencieron, el más reciente.
export function periodoVigente(
  cronogramas: readonly CronogramaDelPeriodo[],
  hoy: string,
): CronogramaDelPeriodo | null {
  const pendiente = cronogramas.find((cronograma) => ultimaFecha(cronograma) >= hoy)
  return pendiente ?? cronogramas.at(-1) ?? null
}
