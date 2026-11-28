import { esCelularPeruano } from '@/compartido/dominio/celular'
import {
  enlaceDeLlamada,
  enlaceDeWhatsApp,
  formatearCelular,
} from '@/compartido/dominio/enlaces-de-contacto'

import type { EstadoDeMensaje } from './mensajes'

// Responder un mensaje. El formulario del sitio no pide celular ni correo (la persona escribe
// al WhatsApp del estudio); el equipo los anota al responder. Solo con un celular válido hay
// enlaces de WhatsApp y llamada.
export interface EnlacesDeRespuesta {
  celular: string
  whatsapp: string
  llamada: string
}

export function enlacesDeRespuesta(celular: string | null): EnlacesDeRespuesta | null {
  if (!celular || !esCelularPeruano(celular)) return null
  return {
    celular: formatearCelular(celular),
    whatsapp: enlaceDeWhatsApp(celular, '').href,
    llamada: enlaceDeLlamada(celular).href,
  }
}

export const ERROR_DE_CELULAR = 'Escribe un celular de 9 dígitos que empiece con 9.'
export const ERROR_DE_CORREO = 'Escribe un correo válido, por ejemplo nombre@correo.com.'

// Copia de la regla `email` de Payload 3.94 (`payload/dist/fields/validations.js`, `emailRegex`):
// sin puntos seguidos, sin espacios ni tildes, dominio sin guion al inicio o al final y extensión
// de 2 o más letras. Tiene que ser la misma: lo que aquí pase, Payload lo debe aceptar al guardar.
const PATRON_DE_CORREO =
  /^(?!.*\.\.)[\w!#$%&'*+/=?^`{|}~-](?:[\w!#$%&'*+/=?^`{|}~.-]*[\w!#$%&'*+/=?^`{|}~-])?@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/i
const LARGO_MAXIMO_DE_CORREO = 254

export interface DatosDeContacto {
  celular: string | null
  correo: string | null
}

export type ErroresDeContacto = Partial<Record<keyof DatosDeContacto, string>>

export type ValidacionDeContacto =
  { valido: true; datos: DatosDeContacto } | { valido: false; errores: ErroresDeContacto }

const comoTexto = (valor: unknown): string => (typeof valor === 'string' ? valor.trim() : '')

// La misma regla vale para el correo de una sede (también un campo `email` de Payload).
export const esCorreoValido = (correo: string): boolean =>
  correo.length <= LARGO_MAXIMO_DE_CORREO && PATRON_DE_CORREO.test(correo)

export function validarDatosDeContacto(entrada: {
  celular: unknown
  correo: unknown
}): ValidacionDeContacto {
  const celular = comoTexto(entrada.celular)
  const correo = comoTexto(entrada.correo)
  const errores: ErroresDeContacto = {}
  if (celular && !esCelularPeruano(celular)) errores.celular = ERROR_DE_CELULAR
  if (correo && !esCorreoValido(correo)) errores.correo = ERROR_DE_CORREO
  if (Object.keys(errores).length > 0) return { valido: false, errores }
  return {
    valido: true,
    datos: { celular: celular ? formatearCelular(celular) : null, correo: correo || null },
  }
}

export interface Aviso {
  titulo: string
  detalle?: string
}

export function avisoDeCambioDeEstado(nombre: string, estado: EstadoDeMensaje): Aviso {
  if (estado === 'atendido')
    return {
      titulo: `Mensaje de ${nombre} atendido`,
      detalle: 'Ya no cuenta como pendiente en el inicio.',
    }
  return {
    titulo: `Mensaje de ${nombre} vuelve a «Nuevo»`,
    detalle: 'Vuelve a contar como pendiente.',
  }
}
