import type { ContactoDelSitio } from '@/compartido/dominio/configuracion-del-sitio'
import { type TipoDeDestino, validarDestino } from '@/compartido/dominio/destino-de-enlace'
import { enlaceDeLlamada } from '@/compartido/dominio/enlaces-de-contacto'
import { enlaceDeConsulta } from '@/modulos/contacto/dominio/enlace-de-consulta'

// Botón de una portada: WhatsApp y llamada usan los celulares de la configuración del sitio;
// los demás tipos llevan a una sección, una página interna o un sitio externo.
export type TipoDeAccion = 'whatsapp' | 'llamada' | TipoDeDestino
export type EstiloDeAccion = 'principal' | 'secundario'

export interface AccionGuardada {
  etiqueta: string
  tipo: TipoDeAccion
  mensaje: string | null
  destino: string | null
  estilo: EstiloDeAccion
}

export interface AccionDePortada {
  etiqueta: string
  estilo: EstiloDeAccion
  href: string
  icono: 'whatsapp' | 'telefono' | null
  externo: boolean
}

// Un destino inválido no se publica (el panel ya lo impide al guardar).
export function resolverAccion(
  accion: AccionGuardada,
  contacto: ContactoDelSitio,
): AccionDePortada | null {
  const base = { etiqueta: accion.etiqueta, estilo: accion.estilo }
  if (accion.tipo === 'whatsapp') {
    const { href } = enlaceDeConsulta(contacto, accion.mensaje)
    return { ...base, href, icono: 'whatsapp', externo: false }
  }
  if (accion.tipo === 'llamada') {
    const { href } = enlaceDeLlamada(contacto.celularDeLlamadas)
    return { ...base, href, icono: 'telefono', externo: false }
  }
  const destino = accion.destino?.trim() ?? ''
  if (!destino || validarDestino(accion.tipo, destino) !== null) return null
  return { ...base, href: destino, icono: null, externo: accion.tipo === 'externa' }
}
