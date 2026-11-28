import { MAXIMO_DE_PORTADAS, SEGUNDOS_MAXIMOS, SEGUNDOS_MINIMOS } from './carrusel-de-portadas'
import {
  ERROR_DE_SEGUNDOS,
  ERROR_DEMASIADAS_PORTADAS,
  ERROR_IMAGEN_INEXISTENTE,
  ERROR_SIN_PORTADAS,
  type ErroresDelCarrusel,
  type ErroresDePortada,
} from './errores-del-carrusel'
import { ERROR_DE_FORMULARIO } from './formularios'
import { type CarruselLeido, leerFormularioDelCarrusel } from './lectura-del-carrusel'
import { erroresDePortada, portadaValidada, type PortadaValidada } from './validacion-de-portada'

// Validación en el servidor del formulario del carrusel (`unknown`): la forma, luego las reglas
// del bloque. Así el error llega junto a su campo antes de tocar Payload.
export interface CarruselValidado {
  seccion: string
  actualizadoEn: string
  segundosPorPortada: number
  portadas: PortadaValidada[]
}

export type ValidacionDelCarrusel =
  { valido: true; datos: CarruselValidado } | { valido: false; errores: ErroresDelCarrusel }

const SOLO_DIGITOS = /^\d{1,3}$/

function leerSegundos(texto: string): number | null {
  const valor = texto.trim()
  if (!SOLO_DIGITOS.test(valor)) return null
  const segundos = Number(valor)
  return segundos >= SEGUNDOS_MINIMOS && segundos <= SEGUNDOS_MAXIMOS ? segundos : null
}

function erroresDeLaLista(leido: CarruselLeido): ErroresDelCarrusel {
  if (leido.portadas.length === 0) return { portadas: ERROR_SIN_PORTADAS }
  if (leido.portadas.length > MAXIMO_DE_PORTADAS) return { portadas: ERROR_DEMASIADAS_PORTADAS }
  const portada: Record<number, ErroresDePortada> = {}
  leido.portadas.forEach((actual, indice) => {
    const errores = erroresDePortada(actual)
    if (errores) portada[indice] = errores
  })
  return Object.keys(portada).length > 0 ? { portada } : {}
}

export function validarFormularioDelCarrusel(entrada: unknown): ValidacionDelCarrusel {
  const leido = leerFormularioDelCarrusel(entrada)
  if (!leido) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const segundosPorPortada = leerSegundos(leido.segundosPorPortada)
  const errores = {
    ...(segundosPorPortada === null ? { segundos: ERROR_DE_SEGUNDOS } : {}),
    ...erroresDeLaLista(leido),
  }
  if (segundosPorPortada === null || Object.keys(errores).length > 0)
    return { valido: false, errores }
  const portadas = leido.portadas.flatMap((p) =>
    p.imagen === null ? [] : [portadaValidada(p, p.imagen)],
  )
  return {
    valido: true,
    datos: {
      seccion: leido.seccion,
      actualizadoEn: leido.actualizadoEn,
      segundosPorPortada,
      portadas,
    },
  }
}

// Todas las imágenes que usa el carrusel, sin repetir.
export function idsDeImagenes(carrusel: CarruselValidado): number[] {
  const ids = carrusel.portadas.flatMap((p) => [p.imagen, p.imagenParaCelular, p.sello])
  return [...new Set(ids.filter((id) => id !== null))]
}

const CAMPOS_DE_IMAGEN = ['imagen', 'imagenParaCelular', 'sello'] as const

// Errores de las imágenes elegidas que no existen (o la cuenta no puede leer); `null` si todas
// existen.
export function erroresDeImagenesFaltantes(
  carrusel: CarruselValidado,
  existentes: ReadonlySet<number>,
): ErroresDelCarrusel | null {
  const portada: Record<number, ErroresDePortada> = {}
  carrusel.portadas.forEach((actual, indice) => {
    for (const campo of CAMPOS_DE_IMAGEN) {
      const id = actual[campo]
      if (id !== null && !existentes.has(id))
        portada[indice] = { ...portada[indice], [campo]: ERROR_IMAGEN_INEXISTENTE }
    }
  })
  return Object.keys(portada).length > 0 ? { portada } : null
}
