import type { CanalesDeContacto, ContactoDelSitio } from './configuracion-del-sitio'
import { enlaceDeCorreo, enlaceDeLlamada, enlaceDeWhatsApp } from './enlaces-de-contacto'

export function prepararCanalesDeContacto(contacto: ContactoDelSitio): CanalesDeContacto {
  return {
    whatsapp: enlaceDeWhatsApp(contacto.celularWhatsApp, contacto.mensajeWhatsApp),
    llamadas: enlaceDeLlamada(contacto.celularDeLlamadas),
    correo: enlaceDeCorreo(contacto.correo),
    textoDelBotonFlotante: contacto.textoDelBotonFlotante,
  }
}
