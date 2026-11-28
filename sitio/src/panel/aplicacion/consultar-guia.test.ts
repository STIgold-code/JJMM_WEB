import { describe, expect, it } from 'vitest'

import type { CronogramaDelPanel } from '../dominio/cronogramas-del-panel'
import { obtenerGuiaDeClientes, type RepositorioDeLecturaDeLaGuia } from './consultar-guia'

const cronograma = (id: number, anio: number, mes: number): CronogramaDelPanel => ({
  id,
  anio,
  mes,
  periodo: `${mes}/${anio}`,
  fechas: [],
  buenosContribuyentes: null,
})

describe('obtenerGuiaDeClientes', () => {
  it('trae las tres partes y lista los cronogramas del más reciente al más antiguo', async () => {
    const repositorio: RepositorioDeLecturaDeLaGuia = {
      listarAvisos: async () => [],
      listarVencimientos: async () => [],
      listarCronogramas: async () => [
        cronograma(1, 2026, 2),
        cronograma(2, 2025, 12),
        cronograma(3, 2026, 11),
        cronograma(4, 2026, 1),
      ],
    }
    const guia = await obtenerGuiaDeClientes(repositorio)
    expect(guia.avisos).toEqual([])
    expect(guia.vencimientos).toEqual([])
    expect(guia.cronogramas.map((c) => c.id)).toEqual([3, 1, 4, 2])
  })
})
