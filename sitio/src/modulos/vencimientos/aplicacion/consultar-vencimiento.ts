import { fechaDeVencimientoParaRuc } from '../dominio/cronograma-sunat'
import { type MotivoDeRucInvalido, motivoDeRucInvalido, ultimoDigitoDelRuc } from '../dominio/ruc'
import type { PeriodoPublico } from './obtener-cronograma-sunat'

export type ResultadoDeConsulta =
  { tipo: 'fecha'; digito: number; texto: string } | { tipo: 'error'; motivo: MotivoDeRucInvalido }

// Fecha de vencimiento de un RUC en un periodo completo (una fecha por dígito).
export function consultarVencimiento(periodo: PeriodoPublico, valor: string): ResultadoDeConsulta {
  const motivo = motivoDeRucInvalido(valor)
  if (motivo) return { tipo: 'error', motivo }
  const ruc = valor.replace(/\s+/g, '')
  const fecha = fechaDeVencimientoParaRuc(periodo.fechas, ruc)
  const texto = periodo.fechas.find((f) => f.fecha === fecha)?.texto ?? fecha
  return { tipo: 'fecha', digito: ultimoDigitoDelRuc(ruc), texto }
}
