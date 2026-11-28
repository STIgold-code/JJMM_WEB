import { contieneMonto, MENSAJE_SIN_MONTOS } from '@/modulos/planes/dominio/inclusion-de-plan'

import { normalizarParaBuscar } from './busqueda'
import type { FilaEnviada } from './cambios-de-filas'
import { errorDeFilaRepetida } from './filas-de-la-tabla'
import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'
import { LARGO_MAXIMO_CORTO, leerTexto, textoDemasiadoLargo } from './guia-de-clientes'
import { leerId } from './identificadores'

// Validación en el servidor de las filas de la tabla (`unknown`): `{ conocidas, filas }`, la lista
// entera en orden y los ids que el navegador cargó. Aplica las reglas de la colección
// `caracteristicas-de-plan` (nombre obligatorio, único y sin montos) antes de tocar Payload. Una
// fila guardada que falta en la lista solo se borra si el navegador la conocía: si hay una que no
// conocía (alguien la agregó mientras tanto), no se escribe nada y se pide recargar.
export interface ErroresDeFilas {
  general?: string
  // El error de cada fila, por su posición en la lista enviada.
  fila?: Record<number, string>
  // Otra persona cambió las filas: hay que recargar la página.
  tablaCambiada?: true
}

export type ValidacionDeFilas =
  { valido: true; datos: FilaEnviada[] } | { valido: false; errores: ErroresDeFilas }

export const ERROR_DE_TABLA_CAMBIADA =
  'Alguien cambió las filas de la tabla mientras editabas. Recarga la página para ver lo último; tus cambios no se guardaron.'
export const ERROR_DE_FILA_VACIA = 'Escribe el nombre de la fila o quítala.'
const MAXIMO_DE_FILAS = 100

const TABLA_CAMBIADA: ValidacionDeFilas = {
  valido: false,
  errores: { general: ERROR_DE_TABLA_CAMBIADA, tablaCambiada: true },
}

// Ids que el navegador cargó: enteros válidos, sin repetir y con tope.
function leerConocidas(valor: unknown): number[] | null {
  if (!Array.isArray(valor) || valor.length > MAXIMO_DE_FILAS) return null
  const ids = valor.map(leerId)
  if (!ids.every((id): id is number => id !== null)) return null
  return new Set(ids).size === ids.length ? ids : null
}

function leerEnvio(entrada: unknown) {
  if (!esObjeto(entrada)) return null
  const conocidas = leerConocidas(entrada.conocidas)
  const filas = leerFilas(entrada.filas)
  return conocidas && filas ? { conocidas, filas } : null
}

function leerFila(valor: unknown): FilaEnviada | null {
  if (!esObjeto(valor)) return null
  const nombre = leerTexto(valor.nombre)
  const id = valor.id === null ? null : leerId(valor.id)
  if (nombre === null || (valor.id !== null && id === null)) return null
  return { id, nombre }
}

function leerFilas(entrada: unknown): FilaEnviada[] | null {
  if (!Array.isArray(entrada)) return null
  const filas = entrada.map(leerFila)
  return filas.every((fila): fila is FilaEnviada => fila !== null) ? filas : null
}

// La lista coincide con lo guardado: cada id enviado es de una fila guardada que el navegador
// conocía, ninguno se repite y toda fila guardada era conocida (si no, alguien la agregó).
function coincideConLoGuardado(
  filas: readonly FilaEnviada[],
  conocidas: readonly number[],
  guardadas: readonly number[],
): boolean {
  const ids = filas.flatMap((fila) => (fila.id === null ? [] : [fila.id]))
  if (new Set(ids).size !== ids.length) return false
  const validos = ids.every((id) => guardadas.includes(id) && conocidas.includes(id))
  return validos && guardadas.every((id) => conocidas.includes(id))
}

function errorDelNombre(nombre: string): string | null {
  if (nombre === '') return ERROR_DE_FILA_VACIA
  if (nombre.length > LARGO_MAXIMO_CORTO) return textoDemasiadoLargo(LARGO_MAXIMO_CORTO)
  return contieneMonto(nombre) ? MENSAJE_SIN_MONTOS : null
}

function erroresPorFila(filas: readonly FilaEnviada[]): Record<number, string> {
  const vistas = new Map<string, number>()
  const errores: Record<number, string> = {}
  filas.forEach(({ nombre }, posicion) => {
    const clave = normalizarParaBuscar(nombre)
    const anterior = vistas.get(clave)
    const error = errorDelNombre(nombre)
    if (error) errores[posicion] = error
    else if (anterior !== undefined) errores[posicion] = errorDeFilaRepetida(anterior)
    if (anterior === undefined) vistas.set(clave, posicion + 1)
  })
  return errores
}

export function validarFilas(entrada: unknown, guardadas: readonly number[]): ValidacionDeFilas {
  const envio = leerEnvio(entrada)
  if (!envio) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const { filas, conocidas } = envio
  if (filas.length > MAXIMO_DE_FILAS)
    return {
      valido: false,
      errores: { general: `La tabla puede tener hasta ${MAXIMO_DE_FILAS} filas.` },
    }
  if (!coincideConLoGuardado(filas, conocidas, guardadas)) return TABLA_CAMBIADA
  const fila = erroresPorFila(filas)
  if (Object.keys(fila).length > 0) return { valido: false, errores: { fila } }
  return { valido: true, datos: filas }
}
