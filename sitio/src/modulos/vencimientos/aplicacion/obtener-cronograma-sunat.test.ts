import { describe, expect, it } from 'vitest'

import type { CronogramaDelPeriodo } from '../dominio/periodo-vigente'
import { crearObtenerCronogramaSunat } from './obtener-cronograma-sunat'
import type { RepositorioCronogramasSunat } from './repositorio-cronogramas-sunat'

// Fechas de ejemplo para las pruebas, no un cronograma oficial.
const cronograma = (anio: number, mes: number, dia: number): CronogramaDelPeriodo => ({
  anio,
  mes,
  periodo: `Periodo ${mes}/${anio}`,
  fechas: Array.from({ length: 10 }, (_, digito) => ({
    digito,
    fecha: `${mes === 12 ? anio + 1 : anio}-${String((mes % 12) + 1).padStart(2, '0')}-${String(dia + digito).padStart(2, '0')}`,
  })),
  fechaBuenosContribuyentes: null,
})

const repositorioCon = (cronogramas: CronogramaDelPeriodo[]) => {
  const pedidos: number[] = []
  const repositorio: RepositorioCronogramasSunat = {
    listarDesde: async (anio) => {
      pedidos.push(anio)
      return cronogramas
    },
  }
  return { repositorio, pedidos }
}

// 10 de febrero de 2026 a las 10:00 en Lima.
const AHORA = new Date('2026-02-10T15:00:00Z')

describe('crearObtenerCronogramaSunat', () => {
  it('pide los cronogramas desde el año anterior, por el diciembre que vence en enero', async () => {
    const { repositorio, pedidos } = repositorioCon([])

    await crearObtenerCronogramaSunat(repositorio)(AHORA)

    expect(pedidos).toEqual([2025])
  })

  it('sin cronogramas del año, devuelve el año y ningún periodo', async () => {
    const { repositorio } = repositorioCon([cronograma(2025, 6, 10)])

    const resultado = await crearObtenerCronogramaSunat(repositorio)(AHORA)

    expect(resultado).toEqual({ anio: 2026, periodos: [], claveVigente: null })
  })

  it('ofrece los periodos del año en orden y marca el vigente a la fecha de Lima', async () => {
    const { repositorio } = repositorioCon([
      cronograma(2026, 1, 12),
      cronograma(2025, 12, 12),
      cronograma(2026, 2, 12),
    ])

    const resultado = await crearObtenerCronogramaSunat(repositorio)(AHORA)

    expect(resultado.periodos.map((p) => p.clave)).toEqual(['2025-12', '2026-01', '2026-02'])
    expect(resultado.claveVigente).toBe('2026-01')
  })

  it('omite los periodos a los que les falta la fecha de algún dígito', async () => {
    const incompleto = { ...cronograma(2026, 1, 12), fechas: [] }
    const { repositorio } = repositorioCon([incompleto, cronograma(2026, 2, 12)])

    const resultado = await crearObtenerCronogramaSunat(repositorio)(AHORA)

    expect(resultado.periodos.map((p) => p.clave)).toEqual(['2026-02'])
    expect(resultado.claveVigente).toBe('2026-02')
  })

  it('escribe cada fecha completa junto a su fecha ISO', async () => {
    const enero: CronogramaDelPeriodo = {
      ...cronograma(2026, 1, 12),
      fechaBuenosContribuyentes: '2026-02-23',
    }
    const { repositorio } = repositorioCon([enero])

    const [periodo] = (await crearObtenerCronogramaSunat(repositorio)(AHORA)).periodos

    expect(periodo?.periodo).toBe('Periodo 1/2026')
    expect(periodo?.fechas[0]).toEqual({
      digito: 0,
      fecha: '2026-02-12',
      texto: 'jueves, 12 de febrero de 2026',
    })
    expect(periodo?.buenosContribuyentes).toBe('lunes, 23 de febrero de 2026')
  })
})
