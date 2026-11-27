import type { ConfiguracionDelSitio as ConfiguracionPayload } from '@/payload-types'

import type {
  ConfiguracionDelSitio,
  ContactoDelSitio,
  Marca,
  SeoPorDefecto,
} from '../dominio/configuracion-del-sitio'
import { aImagen } from './imagen-de-medio'

// Una global que nunca se guardó llega sin sus grupos o con campos vacíos.
type ConfiguracionGuardada = Partial<Omit<ConfiguracionPayload, 'id'>> & { id?: number }

const tieneTextos = (valores: readonly (string | null | undefined)[]): boolean =>
  valores.every((valor) => typeof valor === 'string' && valor.trim().length > 0)

function mapearMarca(marca: ConfiguracionPayload['marca'] | undefined): Marca | null {
  if (!marca || !tieneTextos([marca.nombreComercial, marca.razonSocial])) return null
  return {
    nombreComercial: marca.nombreComercial,
    razonSocial: marca.razonSocial,
    grupo: marca.grupo || null,
    lema: marca.lema || null,
    logo: aImagen(marca.logo),
    sello: aImagen(marca.sello),
  }
}

function mapearContacto(
  contacto: ConfiguracionPayload['contacto'] | undefined,
): ContactoDelSitio | null {
  if (!contacto) return null
  const { correo, celularWhatsApp, mensajeWhatsApp, celularDeLlamadas } = contacto
  const { textoDelBotonFlotante } = contacto
  const textos = [correo, celularWhatsApp, mensajeWhatsApp, celularDeLlamadas]
  if (!tieneTextos([...textos, textoDelBotonFlotante])) return null
  return { correo, celularWhatsApp, mensajeWhatsApp, celularDeLlamadas, textoDelBotonFlotante }
}

function mapearSeo(seo: ConfiguracionPayload['seo'] | undefined): SeoPorDefecto | null {
  if (!seo || !tieneTextos([seo.titulo, seo.descripcion])) return null
  return { titulo: seo.titulo, descripcion: seo.descripcion }
}

// Devuelve null si falta un dato obligatorio: la estructura no se dibuja a medias.
export function mapearConfiguracion(guardada: ConfiguracionGuardada): ConfiguracionDelSitio | null {
  const marca = mapearMarca(guardada.marca)
  const contacto = mapearContacto(guardada.contacto)
  const seo = mapearSeo(guardada.seo)
  if (!marca || !contacto || !seo) return null
  const redes = (guardada.redesSociales ?? []).map(({ red, url }) => ({ red, url }))
  return { marca, contacto, redes, seo }
}
