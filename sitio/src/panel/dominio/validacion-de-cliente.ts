import { esUrlHttps } from '@/compartido/dominio/destino-de-enlace'

import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'
import {
  LARGO_MAXIMO_CORTO,
  leerTexto,
  soloConError,
  textoDemasiadoLargo,
} from './guia-de-clientes'
import { leerId } from './identificadores'

// Validación en el servidor del formulario de un cliente (`unknown`). Aplica las reglas de la
// colección `clientes` (nombre y logotipo obligatorios, sitio web https opcional, la misma regla
// que `validarUrlHttpsOpcional`) más un tope de largo. El orden nunca llega del navegador.
export interface ClienteValidado {
  nombre: string
  enlace: string | null
  logo: number
  visible: boolean
}

export interface ErroresDeCliente {
  general?: string
  nombre?: string
  enlace?: string
  logo?: string
}

export const ERROR_DE_LOGO = 'Elige o sube el logotipo del cliente.'
export const ERROR_DE_ENLACE = 'Ingresa una dirección https://, por ejemplo https://www.cliente.com'

const LARGO_MAXIMO_DEL_ENLACE = 500

interface Leido {
  nombre: string
  enlace: string
  logo: number | null
  visible: boolean
}

// `logo` nulo (sin elegir) es un error del campo; cualquier otra cosa que no sea un id, no.
function leerFormulario(entrada: unknown): Leido | null {
  if (!esObjeto(entrada)) return null
  const nombre = leerTexto(entrada.nombre)
  const enlace = leerTexto(entrada.enlace)
  const logo = entrada.logo === null ? null : leerId(entrada.logo)
  const { visible } = entrada
  if (nombre === null || enlace === null || typeof visible !== 'boolean') return null
  if (entrada.logo !== null && logo === null) return null
  return { nombre, enlace, logo, visible }
}

function errorDelNombre(nombre: string): string | null {
  if (nombre === '') return 'Escribe el nombre del cliente.'
  return nombre.length > LARGO_MAXIMO_CORTO ? textoDemasiadoLargo(LARGO_MAXIMO_CORTO) : null
}

function errorDelEnlace(enlace: string): string | null {
  if (enlace === '') return null
  if (enlace.length > LARGO_MAXIMO_DEL_ENLACE) return textoDemasiadoLargo(LARGO_MAXIMO_DEL_ENLACE)
  return esUrlHttps(enlace) ? null : ERROR_DE_ENLACE
}

export function validarFormularioDeCliente(
  entrada: unknown,
): { valido: true; datos: ClienteValidado } | { valido: false; errores: ErroresDeCliente } {
  const leido = leerFormulario(entrada)
  if (!leido) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const { nombre, enlace, logo, visible } = leido
  const errores = soloConError({
    nombre: errorDelNombre(nombre),
    logo: logo === null ? ERROR_DE_LOGO : null,
    enlace: errorDelEnlace(enlace),
  })
  if (Object.keys(errores).length > 0 || logo === null) return { valido: false, errores }
  return { valido: true, datos: { nombre, enlace: enlace || null, logo, visible } }
}
