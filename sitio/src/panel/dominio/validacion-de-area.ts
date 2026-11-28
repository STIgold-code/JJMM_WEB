import { esListaDePuntosValida } from '@/modulos/servicios/dominio/area-de-servicio'

import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'
import {
  LARGO_MAXIMO_CORTO,
  leerTexto,
  soloConError,
  textoDemasiadoLargo,
} from './guia-de-clientes'

// Validación en el servidor del formulario de un área (`unknown`). Aplica las reglas de la
// colección `areas-de-servicio` (nombre, nombre corto y descripción obligatorios, cada punto con
// texto, gajo con la regla de la rueda) más topes contra entradas desmedidas. El código y el orden
// nunca llegan del navegador: no se leen.
export interface AreaValidada {
  nombre: string
  nombreCorto: string
  descripcion: string
  puntos: string[]
  mensajeDeConsulta: string | null
  poligono: string | null
}

// `punto`: el error de cada punto, por su posición; `puntos`, el de la lista entera.
export interface ErroresDeArea {
  general?: string
  nombre?: string
  nombreCorto?: string
  descripcion?: string
  puntos?: string
  punto?: Record<number, string>
  mensaje?: string
  poligono?: string
}

export type ValidacionDeArea =
  { valido: true; datos: AreaValidada } | { valido: false; errores: ErroresDeArea }

// El mismo texto que la colección.
export const ERROR_DE_POLIGONO =
  'Escribe al menos tres puntos «x,y» separados por espacios, por ejemplo «72.8,155.8 174.1,78.7 216.5,191.5».'
export const ERROR_DE_PUNTO = 'Escribe el punto o quítalo.'

const LARGO_MAXIMO_DEL_NOMBRE_CORTO = 60
const LARGO_MAXIMO_LARGO = 2000
export const MAXIMO_DE_PUNTOS = 30

export const esPoligonoValido = (texto: string): boolean => esListaDePuntosValida(texto)

interface Leido {
  nombre: string
  nombreCorto: string
  descripcion: string
  puntos: string[]
  mensaje: string
  poligono: string
}

function leerPuntos(valor: unknown): string[] | null {
  if (!Array.isArray(valor)) return null
  const puntos = valor.map(leerTexto)
  return puntos.every((p): p is string => p !== null) ? puntos : null
}

function leerFormulario(entrada: unknown): Leido | null {
  if (!esObjeto(entrada)) return null
  const textos = [
    entrada.nombre,
    entrada.nombreCorto,
    entrada.descripcion,
    entrada.mensaje,
    entrada.poligono,
  ].map(leerTexto)
  const puntos = leerPuntos(entrada.puntos)
  const [nombre, nombreCorto, descripcion, mensaje, poligono] = textos
  if (textos.some((t) => t == null) || !puntos) return null
  return {
    nombre: nombre ?? '',
    nombreCorto: nombreCorto ?? '',
    descripcion: descripcion ?? '',
    puntos,
    mensaje: mensaje ?? '',
    poligono: poligono ?? '',
  }
}

function errorObligatorio(texto: string, vacio: string, maximo: number): string | null {
  if (texto === '') return vacio
  return texto.length > maximo ? textoDemasiadoLargo(maximo) : null
}

const errorOpcional = (texto: string, maximo: number): string | null =>
  texto.length > maximo ? textoDemasiadoLargo(maximo) : null

function erroresDePuntos(puntos: readonly string[]): Pick<ErroresDeArea, 'puntos' | 'punto'> {
  if (puntos.length > MAXIMO_DE_PUNTOS)
    return { puntos: `Un área puede tener hasta ${MAXIMO_DE_PUNTOS} puntos.` }
  const punto: Record<number, string> = {}
  puntos.forEach((texto, indice) => {
    const error = errorObligatorio(texto, ERROR_DE_PUNTO, LARGO_MAXIMO_CORTO)
    if (error) punto[indice] = error
  })
  return Object.keys(punto).length > 0 ? { punto } : {}
}

function errorDelPoligono(poligono: string): string | null {
  if (poligono === '') return null
  return esPoligonoValido(poligono) ? null : ERROR_DE_POLIGONO
}

function erroresDe(leido: Leido): ErroresDeArea {
  const { nombre, nombreCorto, descripcion } = leido
  return {
    ...soloConError({
      nombre: errorObligatorio(nombre, 'Escribe el nombre del área.', LARGO_MAXIMO_CORTO),
      nombreCorto: errorObligatorio(
        nombreCorto,
        'Escribe el nombre corto de la pestaña.',
        LARGO_MAXIMO_DEL_NOMBRE_CORTO,
      ),
      descripcion: errorObligatorio(
        descripcion,
        'Escribe la descripción del área.',
        LARGO_MAXIMO_LARGO,
      ),
      mensaje: errorOpcional(leido.mensaje, LARGO_MAXIMO_CORTO * 2),
      poligono: errorDelPoligono(leido.poligono),
    }),
    ...erroresDePuntos(leido.puntos),
  }
}

export function validarFormularioDeArea(entrada: unknown): ValidacionDeArea {
  const leido = leerFormulario(entrada)
  if (!leido) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const errores = erroresDe(leido)
  if (Object.keys(errores).length > 0) return { valido: false, errores }
  const { nombre, nombreCorto, descripcion, puntos, mensaje, poligono } = leido
  return {
    valido: true,
    datos: {
      nombre,
      nombreCorto,
      descripcion,
      puntos,
      mensajeDeConsulta: mensaje || null,
      poligono: poligono || null,
    },
  }
}
