import { obtenerPayload } from '@/compartido/infraestructura/instancia-payload'
import type { CronogramasSunat } from '@/payload-types'

import type { RepositorioCronogramasSunat } from '../aplicacion/repositorio-cronogramas-sunat'
import { nombreDelPeriodo } from '../dominio/cronograma-sunat'
import { diaEnLima } from '../dominio/fechas'
import type { CronogramaDelPeriodo } from '../dominio/periodo-vigente'

// Dos años de periodos mensuales como máximo.
const MAXIMO_DE_CRONOGRAMAS = 24

// Payload guarda las fechas como instantes; el cronograma usa el día de Lima.
const aDia = (instante: string): string => diaEnLima(new Date(instante))

export function mapearCronograma(cronograma: CronogramasSunat): CronogramaDelPeriodo {
  const { anio, mes, fechaBuenosContribuyentes } = cronograma
  return {
    anio,
    mes,
    periodo: cronograma.periodo || nombreDelPeriodo(anio, mes),
    fechas: (cronograma.fechasPorDigito ?? []).map(({ digito, fecha }) => ({
      digito,
      fecha: aDia(fecha),
    })),
    fechaBuenosContribuyentes: fechaBuenosContribuyentes ? aDia(fechaBuenosContribuyentes) : null,
  }
}

export const repositorioCronogramasSunatPayload: RepositorioCronogramasSunat = {
  async listarDesde(anio) {
    const payload = await obtenerPayload()
    const { docs } = await payload.find({
      collection: 'cronogramas-sunat',
      where: { anio: { greater_than_equal: anio } },
      // Del más antiguo al más reciente: si hubiera más del límite, se cortan los futuros.
      sort: ['anio', 'mes'],
      depth: 0,
      limit: MAXIMO_DE_CRONOGRAMAS,
      pagination: false,
      overrideAccess: false,
    })
    return docs.map(mapearCronograma)
  },
}
