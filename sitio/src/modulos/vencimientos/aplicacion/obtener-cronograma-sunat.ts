import { diaEnLima, formatearFecha } from '../dominio/fechas'
import {
  claveDelPeriodo,
  type CronogramaDelPeriodo,
  cronogramasDelAnio,
  esCronogramaCompleto,
  periodoVigente,
} from '../dominio/periodo-vigente'
import type { RepositorioCronogramasSunat } from './repositorio-cronogramas-sunat'

export interface FechaPublica {
  digito: number
  // AAAA-MM-DD, para buscar la fecha por RUC.
  fecha: string
  // Fecha completa para leer, por ejemplo «viernes, 13 de febrero de 2026».
  texto: string
}

export interface PeriodoPublico {
  clave: string
  periodo: string
  fechas: FechaPublica[]
  buenosContribuyentes: string | null
}

export interface CronogramaSunatPublico {
  anio: number
  // Vacío si el panel todavía no tiene el cronograma del año.
  periodos: PeriodoPublico[]
  claveVigente: string | null
}

function prepararPeriodo(cronograma: CronogramaDelPeriodo): PeriodoPublico {
  const { anio, mes, periodo, fechas, fechaBuenosContribuyentes } = cronograma
  return {
    clave: claveDelPeriodo(anio, mes),
    periodo,
    fechas: fechas.map(({ digito, fecha }) => ({ digito, fecha, texto: formatearFecha(fecha) })),
    buenosContribuyentes: fechaBuenosContribuyentes
      ? formatearFecha(fechaBuenosContribuyentes)
      : null,
  }
}

// Cronograma de SUNAT del año en curso en Lima, con el periodo vigente marcado.
export function crearObtenerCronogramaSunat(repositorio: RepositorioCronogramasSunat) {
  return async (ahora: Date): Promise<CronogramaSunatPublico> => {
    const hoy = diaEnLima(ahora)
    const anio = Number(hoy.slice(0, 4))
    const guardados = await repositorio.listarDesde(anio - 1)
    const delAnio = cronogramasDelAnio(guardados.filter(esCronogramaCompleto), anio)
    const vigente = periodoVigente(delAnio, hoy)
    return {
      anio,
      periodos: delAnio.map(prepararPeriodo),
      claveVigente: vigente ? claveDelPeriodo(vigente.anio, vigente.mes) : null,
    }
  }
}
