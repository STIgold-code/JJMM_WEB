import type { ResultadoDeEnvio } from '../aplicacion/enviar-mensaje-de-contacto'
import type { DatosDelFormulario, ErroresDelMensaje } from '../dominio/mensaje-de-contacto'

// Estado que la acción del servidor devuelve al formulario. Cuando el envío no se guarda,
// trae los valores escritos para que el formulario no los pierda al reiniciarse.
export type EstadoDelFormulario =
  | { estado: 'inicial' }
  | { estado: 'enviado' }
  | { estado: 'invalido'; errores: ErroresDelMensaje; valores: DatosDelFormulario }
  | { estado: 'limite'; valores: DatosDelFormulario }
  | { estado: 'error'; valores: DatosDelFormulario }

export const ESTADO_INICIAL: EstadoDelFormulario = { estado: 'inicial' }

// Nombres de los campos ocultos contra robots.
export const CAMPO_TRAMPA = 'sitioWeb'
export const CAMPO_INICIO = 'inicio'

const texto = (formulario: FormData, nombre: string): string => {
  const valor = formulario.get(nombre)
  return typeof valor === 'string' ? valor : ''
}

export function leerDatos(formulario: FormData): DatosDelFormulario {
  return {
    nombre: texto(formulario, 'nombre'),
    celular: texto(formulario, 'celular'),
    correo: texto(formulario, 'correo'),
    servicio: texto(formulario, 'servicio'),
    mensaje: texto(formulario, 'mensaje'),
  }
}

export function leerTrampa(formulario: FormData): string {
  return texto(formulario, CAMPO_TRAMPA)
}

export function leerInicio(formulario: FormData): number | null {
  const inicio = Number(texto(formulario, CAMPO_INICIO))
  return Number.isFinite(inicio) && inicio > 0 ? inicio : null
}

export function aEstado(
  resultado: ResultadoDeEnvio,
  valores: DatosDelFormulario,
): EstadoDelFormulario {
  if (resultado.estado === 'invalido') return { ...resultado, valores }
  if (resultado.estado === 'limite') return { estado: 'limite', valores }
  return { estado: 'enviado' }
}

export function valoresDe(estado: EstadoDelFormulario): DatosDelFormulario | null {
  return 'valores' in estado ? estado.valores : null
}
