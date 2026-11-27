import type { Sede } from '@/payload-types'

import type { SedeDeContactoGuardada } from '../dominio/sede-de-contacto'

// `enlaceDeMapa` guarda la dirección del mapa insertado; el dominio decide si se puede usar.
export function mapearSedeDeContacto(sede: Sede): SedeDeContactoGuardada {
  return {
    nombre: sede.nombre,
    direccion: sede.direccion,
    distrito: sede.distrito,
    ciudad: sede.ciudad,
    celulares: (sede.celulares ?? []).map((celular) => ({
      numero: celular.numero,
      tieneWhatsApp: celular.tieneWhatsApp === true,
    })),
    mapaIncrustado: sede.enlaceDeMapa?.trim() || null,
  }
}
