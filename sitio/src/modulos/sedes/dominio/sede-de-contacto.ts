import {
  type EnlaceDeContacto,
  enlaceDeLlamada,
  enlaceDeWhatsApp,
} from '@/compartido/dominio/enlaces-de-contacto'

import { urlDelMapaIncrustado, urlParaComoLlegar } from './mapa-de-sede'

export interface CelularDeSede {
  numero: string
  tieneWhatsApp: boolean
}

// Sede tal como la lee la sección «Contáctanos»: con sus celulares y su mapa del panel.
export interface SedeDeContactoGuardada {
  nombre: string
  direccion: string
  distrito: string
  ciudad: string
  celulares: readonly CelularDeSede[]
  mapaIncrustado: string | null
}

// Pestaña de una sede en «Contáctanos» (v5): el distrito nombra la pestaña.
export interface SedeDeContacto {
  nombre: string
  pestana: string
  direccion: string
  whatsapp: EnlaceDeContacto | null
  llamada: EnlaceDeContacto | null
  comoLlegar: string
  mapa: string
}

// WhatsApp con el primer celular que lo atiende; la llamada, con el primero de los otros (o
// con el mismo si es el único). Un teléfono fijo es un error de datos y no se oculta (S9).
export function prepararSedeDeContacto(
  sede: SedeDeContactoGuardada,
  mensajeWhatsApp: string,
): SedeDeContacto {
  const direccion = `${sede.direccion}, ${sede.distrito}, ${sede.ciudad}`
  const conWhatsApp = sede.celulares.find((celular) => celular.tieneWhatsApp)
  const deLlamada = sede.celulares.find((celular) => celular !== conWhatsApp) ?? conWhatsApp
  return {
    nombre: sede.nombre,
    pestana: sede.distrito,
    direccion,
    whatsapp: conWhatsApp ? enlaceDeWhatsApp(conWhatsApp.numero, mensajeWhatsApp) : null,
    llamada: deLlamada ? enlaceDeLlamada(deLlamada.numero) : null,
    comoLlegar: urlParaComoLlegar(direccion),
    mapa: urlDelMapaIncrustado(sede.mapaIncrustado, direccion),
  }
}
