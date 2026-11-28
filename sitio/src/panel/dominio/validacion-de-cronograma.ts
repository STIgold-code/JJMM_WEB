import {
  type FechaPorDigito,
  validarFechasPorDigito,
} from '@/modulos/vencimientos/dominio/cronograma-sunat'

import { DIGITOS_DEL_RUC } from './cronogramas-del-panel'
import { leerFechaDelFormulario } from './fechas-de-cronograma'
import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'

// Validación en el servidor del formulario de un cronograma de SUNAT (`unknown`). Aplica las
// reglas de la colección `cronogramas-sunat`: año de 2020 a 2100, mes de 1 a 12 y una fecha por
// cada último dígito del RUC (`validarFechasPorDigito`, la misma regla de la colección). Cada
// fecha se lee como día de calendario estricto (AAAA-MM-DD que existe).
export interface CronogramaValidado {
  anio: number
  mes: number
  fechas: FechaPorDigito[]
  buenosContribuyentes: string | null
}

export interface ErroresDeCronograma {
  general?: string
  anio?: string
  mes?: string
  // El error de cada fecha, por su dígito.
  fechas?: Record<number, string>
  buenosContribuyentes?: string
}

export type ValidacionDeCronograma =
  { valido: true; datos: CronogramaValidado } | { valido: false; errores: ErroresDeCronograma }

export const ERROR_DE_FECHA = 'Esa fecha no existe. Revísala.'
const ERROR_DE_ANIO = 'Escribe un año entre 2020 y 2100.'
const ERROR_DE_MES = 'Elige el mes del periodo.'
const SOLO_DIGITOS = /^\d{1,4}$/

// Un entero entre `minimo` y `maximo`, como número o como texto de solo dígitos.
function leerEntero(valor: unknown, minimo: number, maximo: number): number | null {
  const numero = typeof valor === 'string' && SOLO_DIGITOS.test(valor) ? Number(valor) : valor
  if (typeof numero !== 'number' || !Number.isInteger(numero)) return null
  return numero >= minimo && numero <= maximo ? numero : null
}

interface Leido {
  anio: unknown
  mes: unknown
  fechas: string[]
  buenosContribuyentes: string
}

function leerFormulario(entrada: unknown): Leido | null {
  if (!esObjeto(entrada)) return null
  const { fechas, buenosContribuyentes } = entrada
  if (!Array.isArray(fechas) || fechas.length !== DIGITOS_DEL_RUC.length) return null
  if (!fechas.every((fecha: unknown): fecha is string => typeof fecha === 'string')) return null
  if (typeof buenosContribuyentes !== 'string') return null
  return { anio: entrada.anio, mes: entrada.mes, fechas, buenosContribuyentes }
}

function errorDeLaFecha(fecha: string, digito: number): string | null {
  if (fecha.trim() === '') return `Escribe la fecha del dígito ${digito}.`
  return leerFechaDelFormulario(fecha) ? null : ERROR_DE_FECHA
}

function erroresDeFechas(fechas: readonly string[]): ErroresDeCronograma {
  const porDigito: Record<number, string> = {}
  fechas.forEach((fecha, digito) => {
    const error = errorDeLaFecha(fecha, digito)
    if (error) porDigito[digito] = error
  })
  return Object.keys(porDigito).length > 0 ? { fechas: porDigito } : {}
}

function erroresDe(leido: Leido, anio: number | null, mes: number | null): ErroresDeCronograma {
  const { buenosContribuyentes } = leido
  const buenosInvalida =
    buenosContribuyentes !== '' && !leerFechaDelFormulario(buenosContribuyentes)
  return {
    ...(anio === null ? { anio: ERROR_DE_ANIO } : {}),
    ...(mes === null ? { mes: ERROR_DE_MES } : {}),
    ...erroresDeFechas(leido.fechas),
    ...(buenosInvalida ? { buenosContribuyentes: ERROR_DE_FECHA } : {}),
  }
}

export function validarFormularioDeCronograma(entrada: unknown): ValidacionDeCronograma {
  const leido = leerFormulario(entrada)
  if (!leido) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const anio = leerEntero(leido.anio, 2020, 2100)
  const mes = leerEntero(leido.mes, 1, 12)
  const errores = erroresDe(leido, anio, mes)
  if (anio === null || mes === null || Object.keys(errores).length > 0)
    return { valido: false, errores }
  const fechas = leido.fechas.map((fecha, digito) => ({ digito, fecha }))
  const reglaDeLaColeccion = validarFechasPorDigito(fechas)
  if (reglaDeLaColeccion) return { valido: false, errores: { general: reglaDeLaColeccion } }
  return {
    valido: true,
    datos: { anio, mes, fechas, buenosContribuyentes: leido.buenosContribuyentes || null },
  }
}
