import type { EnlaceDeContacto } from './enlaces-de-contacto'
import type { Imagen } from './imagen'

// Datos de todo el sitio (marca, contacto, redes y SEO por defecto), editados en el panel.
export const REDES_SOCIALES = [
  'facebook',
  'x',
  'youtube',
  'instagram',
  'tiktok',
  'linkedin',
] as const
export type RedSocial = (typeof REDES_SOCIALES)[number]

export interface EnlaceDeRed {
  red: RedSocial
  url: string
}

export interface Marca {
  nombreComercial: string
  razonSocial: string
  grupo: string | null
  lema: string | null
  logo: Imagen | null
  sello: Imagen | null
}

export interface ContactoDelSitio {
  correo: string
  celularWhatsApp: string
  mensajeWhatsApp: string
  celularDeLlamadas: string
  textoDelBotonFlotante: string
}

export interface SeoPorDefecto {
  titulo: string
  descripcion: string
}

export interface ConfiguracionDelSitio {
  marca: Marca
  contacto: ContactoDelSitio
  redes: readonly EnlaceDeRed[]
  seo: SeoPorDefecto
}

// Canales listos para dibujar: enlaces armados y textos con formato.
export interface CanalesDeContacto {
  whatsapp: EnlaceDeContacto
  llamadas: EnlaceDeContacto
  correo: EnlaceDeContacto
  textoDelBotonFlotante: string
}
