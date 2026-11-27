import type { ContactoDelSitio } from '@/compartido/dominio/configuracion-del-sitio'
import { type EnlaceDeContacto, enlaceDeWhatsApp } from '@/compartido/dominio/enlaces-de-contacto'

type ContactoDeWhatsApp = Pick<ContactoDelSitio, 'celularWhatsApp' | 'mensajeWhatsApp'>

// Enlace de WhatsApp para consultar algo concreto (un servicio, un plan, una portada) con su
// propio mensaje. Sin mensaje propio se usa el de la configuración del sitio.
export function enlaceDeConsulta(
  contacto: ContactoDeWhatsApp,
  mensaje?: string | null,
): EnlaceDeContacto {
  const propio = mensaje?.trim()
  return enlaceDeWhatsApp(contacto.celularWhatsApp, propio || contacto.mensajeWhatsApp)
}
