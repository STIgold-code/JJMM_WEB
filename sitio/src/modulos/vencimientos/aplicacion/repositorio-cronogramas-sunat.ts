import type { CronogramaDelPeriodo } from '../dominio/periodo-vigente'

// Cronogramas de SUNAT guardados en el panel.
export interface RepositorioCronogramasSunat {
  // Los periodos con año igual o posterior a `anio`.
  listarDesde(anio: number): Promise<readonly CronogramaDelPeriodo[]>
}
