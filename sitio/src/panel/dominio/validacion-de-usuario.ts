import { ROLES, type Rol } from '@/compartido/dominio/roles'

import { errorDeClaveNueva } from './contrasenas'
import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'
import { ERROR_DE_CORREO, esCorreoValido } from './respuesta-al-mensaje'

// Validación en el servidor de lo que manda el formulario de una cuenta (`unknown`). Solo se leen
// los campos reales de la colección `usuarios` (nombre, correo, rol y contraseña); cualquier otro
// que llegue se descarta. El correo usa la regla de Payload y se guarda en minúsculas, como lo
// busca el ingreso.
export const ERROR_SIN_NOMBRE = 'Escribe el nombre de la persona.'
export const ERROR_NOMBRE_LARGO = 'Es demasiado largo: usa hasta 100 caracteres.'
export const ERROR_DE_ROL = 'Elige un rol: administrador o editor.'

const LARGO_MAXIMO_DEL_NOMBRE = 100

export interface DatosDeCuenta {
  nombre: string
  correo: string
  rol: Rol
}

export interface CuentaNueva extends DatosDeCuenta {
  clave: string
}

// `clave` nula: la contraseña no cambia.
export interface CambiosDeCuenta extends DatosDeCuenta {
  clave: string | null
}

export interface ErroresDeUsuario {
  general?: string
  nombre?: string
  correo?: string
  rol?: string
  clave?: string
}

type Validacion<T> = { valido: true; datos: T } | { valido: false; errores: ErroresDeUsuario }

interface FormularioLeido {
  nombre: string
  correo: string
  rol: string
  clave: string
}

function leerFormulario(entrada: unknown): FormularioLeido | null {
  if (!esObjeto(entrada)) return null
  const { nombre, correo, rol, clave } = entrada
  if (typeof nombre !== 'string' || typeof correo !== 'string') return null
  if (typeof rol !== 'string' || typeof clave !== 'string') return null
  return { nombre: nombre.trim(), correo: correo.trim().toLowerCase(), rol, clave }
}

export function errorDelNombre(nombre: string): string | null {
  if (nombre === '') return ERROR_SIN_NOMBRE
  return nombre.length > LARGO_MAXIMO_DEL_NOMBRE ? ERROR_NOMBRE_LARGO : null
}

const esRol = (valor: string): valor is Rol => ROLES.some((rol) => rol === valor)

function erroresDe(leido: FormularioLeido, claveObligatoria: boolean): ErroresDeUsuario {
  const errores: ErroresDeUsuario = {}
  const nombre = errorDelNombre(leido.nombre)
  if (nombre) errores.nombre = nombre
  if (!esCorreoValido(leido.correo)) errores.correo = ERROR_DE_CORREO
  if (!esRol(leido.rol)) errores.rol = ERROR_DE_ROL
  const clave = claveObligatoria || leido.clave !== '' ? errorDeClaveNueva(leido.clave) : null
  if (clave) errores.clave = clave
  return errores
}

// Los datos leídos y ya juzgados; la contraseña vacía todavía es `''`.
function validar(entrada: unknown, claveObligatoria: boolean): Validacion<CuentaNueva> {
  const leido = leerFormulario(entrada)
  if (!leido) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const errores = erroresDe(leido, claveObligatoria)
  const { nombre, correo, rol, clave } = leido
  if (Object.keys(errores).length > 0 || !esRol(rol)) return { valido: false, errores }
  return { valido: true, datos: { nombre, correo, rol, clave } }
}

export function validarCuentaNueva(entrada: unknown): Validacion<CuentaNueva> {
  return validar(entrada, true)
}

export function validarCambiosDeCuenta(entrada: unknown): Validacion<CambiosDeCuenta> {
  const resultado = validar(entrada, false)
  if (!resultado.valido) return resultado
  const { clave, ...datos } = resultado.datos
  return { valido: true, datos: { ...datos, clave: clave === '' ? null : clave } }
}
