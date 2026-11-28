import {
  contieneMonto,
  MENSAJE_SIN_MONTOS,
  TIPOS_DE_INCLUSION,
  type TipoDeInclusion,
  validarTextoDeInclusion,
} from '@/modulos/planes/dominio/inclusion-de-plan'

import { ERROR_DE_TABLA_CAMBIADA, ERROR_NOMBRE_VACIO } from './formulario-de-plan'
import { leerId } from './identificadores'

// Validación en el servidor de lo que manda el formulario del plan (`unknown`). Aplica las mismas
// reglas de dominio que la colección (nombre obligatorio, sin montos, texto de cada celda), así
// el error llega junto a su campo antes de tocar Payload.
export const ERROR_DE_FORMULARIO =
  'No se pudo leer el formulario. Recarga la página e inténtalo de nuevo.'

export interface CeldaValidada {
  caracteristica: number
  tipo: TipoDeInclusion
  texto: string | null
}

export interface PlanValidado {
  nombre: string
  mensajeDeConsulta: string | null
  visible: boolean
  celdas: CeldaValidada[]
}

// `celdas`: el error de cada celda, por id de característica.
export interface ErroresDelPlan {
  general?: string
  nombre?: string
  celdas?: Record<number, string>
}

export type ValidacionDelPlan =
  { valido: true; datos: PlanValidado } | { valido: false; errores: ErroresDelPlan }

interface CeldaLeida {
  caracteristica: number
  tipo: TipoDeInclusion
  texto: string
}

const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor)

export function validarNombreDePlan(valor: unknown): { nombre: string } | { error: string } {
  const nombre = typeof valor === 'string' ? valor.trim() : ''
  if (nombre === '') return { error: ERROR_NOMBRE_VACIO }
  return contieneMonto(nombre) ? { error: MENSAJE_SIN_MONTOS } : { nombre }
}

function leerCelda(valor: unknown): CeldaLeida | null {
  if (!esObjeto(valor)) return null
  const caracteristica = leerId(valor.caracteristica)
  const tipo = TIPOS_DE_INCLUSION.find((t) => t === valor.tipo)
  const texto = valor.texto ?? ''
  if (caracteristica === null || !tipo || typeof texto !== 'string') return null
  return { caracteristica, tipo, texto }
}

function leerCeldas(valor: unknown): CeldaLeida[] | null {
  if (!Array.isArray(valor)) return null
  const celdas = valor.map(leerCelda)
  return celdas.every((celda) => celda !== null) ? celdas : null
}

// Una celda por cada característica guardada, sin faltantes, sobrantes ni repetidas.
function cubreLaTabla(celdas: readonly CeldaLeida[], caracteristicas: readonly number[]): boolean {
  const enviadas = new Set(celdas.map((c) => c.caracteristica))
  if (enviadas.size !== celdas.length || celdas.length !== caracteristicas.length) return false
  return caracteristicas.every((id) => enviadas.has(id))
}

function validarCeldas(celdas: readonly CeldaLeida[]) {
  const errores: Record<number, string> = {}
  const validadas = celdas.map(({ caracteristica, tipo, texto }) => {
    const error = validarTextoDeInclusion(tipo, tipo === 'texto' ? texto : null)
    if (error) errores[caracteristica] = error
    return { caracteristica, tipo, texto: tipo === 'texto' ? texto.trim() : null }
  })
  return { validadas, errores }
}

interface FormularioLeido {
  nombre: unknown
  mensajeDeConsulta: string
  visible: boolean
  celdas: CeldaLeida[]
}

// La forma del formulario (tipos), sin juzgar todavía los valores.
function leerFormulario(entrada: unknown): FormularioLeido | null {
  if (!esObjeto(entrada)) return null
  const { nombre, mensajeDeConsulta, visible } = entrada
  const celdas = leerCeldas(entrada.celdas)
  if (typeof mensajeDeConsulta !== 'string' || typeof visible !== 'boolean' || !celdas) return null
  return { nombre, mensajeDeConsulta, visible, celdas }
}

export function validarFormularioDePlan(
  entrada: unknown,
  caracteristicas: readonly number[],
): ValidacionDelPlan {
  const leido = leerFormulario(entrada)
  if (!leido) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const { mensajeDeConsulta, visible, celdas } = leido
  if (!cubreLaTabla(celdas, caracteristicas))
    return { valido: false, errores: { general: ERROR_DE_TABLA_CAMBIADA } }
  const nombre = validarNombreDePlan(leido.nombre)
  const { validadas, errores } = validarCeldas(celdas)
  const conErrorEnCeldas = Object.keys(errores).length > 0
  if ('error' in nombre || conErrorEnCeldas) {
    return {
      valido: false,
      errores: {
        ...('error' in nombre ? { nombre: nombre.error } : {}),
        ...(conErrorEnCeldas ? { celdas: errores } : {}),
      },
    }
  }
  const mensaje = mensajeDeConsulta.trim()
  return {
    valido: true,
    datos: {
      nombre: nombre.nombre,
      mensajeDeConsulta: mensaje || null,
      visible,
      celdas: validadas,
    },
  }
}
