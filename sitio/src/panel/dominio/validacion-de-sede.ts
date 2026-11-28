import { esCelularPeruano } from '@/compartido/dominio/celular'
import { formatearCelular } from '@/compartido/dominio/enlaces-de-contacto'
import { esMapaIncrustadoDeGoogle } from '@/modulos/sedes/dominio/mapa-de-sede'

import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'
import { ERROR_DE_CELULAR, ERROR_DE_CORREO, esCorreoValido } from './respuesta-al-mensaje'
import type { CelularDelPanel } from './sedes'

// Validación en el servidor de lo que manda el formulario de una sede (`unknown`). Aplica las
// mismas reglas que la colección `sedes`: textos obligatorios, al menos un celular, solo
// celulares peruanos (nunca fijos, S9), correo como el `email` de Payload y solo mapas
// insertados de Google Maps. Así el error llega junto a su campo antes de tocar Payload.
export const ERROR_CELULAR_VACIO = 'Escribe el celular o quita esta fila.'
export const ERROR_SIN_CELULARES = 'Agrega al menos un celular.'
export const ERROR_DE_MAPA =
  'Ese no es un mapa insertado. Debe empezar con https://www.google.com/maps/embed.'
export const ERROR_TEXTO_LARGO = 'Es demasiado largo: usa hasta 200 caracteres.'
export const ERROR_MAPA_LARGO = 'Es demasiado largo para ser un mapa insertado de Google Maps.'

// Topes contra entradas desmedidas; ninguna sede real se les acerca.
export const MAXIMO_DE_CELULARES = 10
const LARGO_MAXIMO_DE_TEXTO = 200
const LARGO_MAXIMO_DEL_MAPA = 2000

const CAMPOS_DE_TEXTO = {
  nombre: 'Escribe el nombre de la sede.',
  direccion: 'Escribe la dirección de la sede.',
  distrito: 'Escribe el distrito.',
  ciudad: 'Escribe la ciudad.',
} as const

type CampoDeTexto = keyof typeof CAMPOS_DE_TEXTO

const ORDEN_DE_LOS_TEXTOS: readonly CampoDeTexto[] = ['nombre', 'direccion', 'distrito', 'ciudad']

export interface SedeValidada extends Record<CampoDeTexto, string> {
  celulares: CelularDelPanel[]
  correo: string | null
  mapa: string | null
  visible: boolean
}

// `celular`: el error de cada fila, por su posición en la lista.
export interface ErroresDeSede extends Partial<Record<CampoDeTexto, string>> {
  general?: string
  celulares?: string
  celular?: Record<number, string>
  correo?: string
  mapa?: string
}

export type ValidacionDeSede =
  { valido: true; datos: SedeValidada } | { valido: false; errores: ErroresDeSede }

type FormularioLeido = Record<CampoDeTexto | 'correo' | 'mapa', string> & {
  celulares: CelularDelPanel[]
  visible: boolean
}

function leerCelular(valor: unknown): CelularDelPanel | null {
  if (!esObjeto(valor)) return null
  const { numero, tieneWhatsApp } = valor
  if (typeof numero !== 'string' || typeof tieneWhatsApp !== 'boolean') return null
  return { numero: numero.trim(), tieneWhatsApp }
}

function leerCelulares(valor: unknown): CelularDelPanel[] | null {
  if (!Array.isArray(valor)) return null
  const celulares = valor.map(leerCelular)
  return celulares.every((celular) => celular !== null) ? celulares : null
}

const texto = (valor: unknown): string | null => (typeof valor === 'string' ? valor.trim() : null)

type TextosLeidos = Omit<FormularioLeido, 'celulares' | 'visible'>

function leerTextos(entrada: Record<string, unknown>): TextosLeidos | null {
  const [nombre, direccion, distrito, ciudad, correo, mapa] = [
    entrada.nombre,
    entrada.direccion,
    entrada.distrito,
    entrada.ciudad,
    entrada.correo,
    entrada.mapa,
  ].map(texto)
  if (nombre == null || direccion == null || distrito == null || ciudad == null) return null
  if (correo == null || mapa == null) return null
  return { nombre, direccion, distrito, ciudad, correo, mapa }
}

// La forma del formulario (tipos), sin juzgar todavía los valores.
function leerFormulario(entrada: unknown): FormularioLeido | null {
  if (!esObjeto(entrada)) return null
  const celulares = leerCelulares(entrada.celulares)
  const textos = leerTextos(entrada)
  if (!celulares || !textos || typeof entrada.visible !== 'boolean') return null
  return { ...textos, celulares, visible: entrada.visible }
}

function erroresDeTexto(leido: FormularioLeido): ErroresDeSede {
  const errores: ErroresDeSede = {}
  for (const campo of ORDEN_DE_LOS_TEXTOS) {
    if (leido[campo] === '') errores[campo] = CAMPOS_DE_TEXTO[campo]
    else if (leido[campo].length > LARGO_MAXIMO_DE_TEXTO) errores[campo] = ERROR_TEXTO_LARGO
  }
  return errores
}

function errorDelCelular({ numero }: CelularDelPanel): string | null {
  if (numero === '') return ERROR_CELULAR_VACIO
  return esCelularPeruano(numero) ? null : ERROR_DE_CELULAR
}

function erroresDeCelulares(celulares: readonly CelularDelPanel[]): ErroresDeSede {
  if (celulares.length === 0) return { celulares: ERROR_SIN_CELULARES }
  if (celulares.length > MAXIMO_DE_CELULARES)
    return { celulares: `Una sede puede tener hasta ${MAXIMO_DE_CELULARES} celulares.` }
  const celular: Record<number, string> = {}
  celulares.forEach((actual, indice) => {
    const error = errorDelCelular(actual)
    if (error) celular[indice] = error
  })
  return Object.keys(celular).length > 0 ? { celular } : {}
}

function errorDelMapa(mapa: string): string | null {
  if (mapa === '') return null
  if (mapa.length > LARGO_MAXIMO_DEL_MAPA) return ERROR_MAPA_LARGO
  return esMapaIncrustadoDeGoogle(mapa) ? null : ERROR_DE_MAPA
}

function erroresDeContacto({ correo, mapa }: FormularioLeido): ErroresDeSede {
  const errorDeMapa = errorDelMapa(mapa)
  return {
    ...(errorDeMapa ? { mapa: errorDeMapa } : {}),
    ...(correo !== '' && !esCorreoValido(correo) ? { correo: ERROR_DE_CORREO } : {}),
  }
}

export function validarFormularioDeSede(entrada: unknown): ValidacionDeSede {
  const leido = leerFormulario(entrada)
  if (!leido) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const errores = {
    ...erroresDeTexto(leido),
    ...erroresDeCelulares(leido.celulares),
    ...erroresDeContacto(leido),
  }
  if (Object.keys(errores).length > 0) return { valido: false, errores }
  const { correo, mapa, celulares, ...resto } = leido
  return {
    valido: true,
    datos: {
      ...resto,
      celulares: celulares.map((c) => ({ ...c, numero: formatearCelular(c.numero) })),
      correo: correo || null,
      mapa: mapa || null,
    },
  }
}
