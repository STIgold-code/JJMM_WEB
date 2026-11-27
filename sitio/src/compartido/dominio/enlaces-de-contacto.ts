import { esCelularPeruano, normalizarCelular } from './celular'

// Enlaces de contacto que publica el sitio: WhatsApp, llamada y correo.
// Solo se arman con celulares (S9); un teléfono fijo es un error de datos, no se oculta.
export interface EnlaceDeContacto {
  texto: string
  href: string
}

const CODIGO_DE_PERU = '51'

export class CelularNoPublicableError extends Error {
  constructor(valor: string) {
    super(`El número «${valor}» no es un celular y no se puede publicar.`)
    this.name = 'CelularNoPublicableError'
  }
}

function digitosDeCelular(valor: string): string {
  if (!esCelularPeruano(valor)) throw new CelularNoPublicableError(valor)
  return normalizarCelular(valor)
}

export function formatearCelular(valor: string): string {
  const digitos = digitosDeCelular(valor)
  return `${digitos.slice(0, 3)} ${digitos.slice(3, 6)} ${digitos.slice(6)}`
}

export function enlaceDeWhatsApp(celular: string, mensaje: string): EnlaceDeContacto {
  const base = `https://wa.me/${CODIGO_DE_PERU}${digitosDeCelular(celular)}`
  const texto = mensaje.trim()
  return {
    texto: formatearCelular(celular),
    href: texto ? `${base}?text=${encodeURIComponent(texto)}` : base,
  }
}

export function enlaceDeLlamada(celular: string): EnlaceDeContacto {
  return {
    texto: formatearCelular(celular),
    href: `tel:+${CODIGO_DE_PERU}${digitosDeCelular(celular)}`,
  }
}

export function enlaceDeCorreo(correo: string): EnlaceDeContacto {
  const limpio = correo.trim()
  return { texto: limpio, href: `mailto:${limpio}` }
}
