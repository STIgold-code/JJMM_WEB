import { rutaDeMensajes } from './mensajes'
import { documentoEnAdmin } from './rutas-del-panel'

// Tabla «Pendientes» del inicio: mensajes nuevos y borradores del blog, lo más reciente
// primero. «Ver» abre el mensaje en el panel lateral de /panel/mensajes; el borrador, en
// /admin hasta que exista su pantalla en el panel.
export const LIMITE_DE_PENDIENTES = 8

export interface MensajePendiente {
  id: number
  nombre: string
  servicio: string | null
  recibido: string
}

export interface BorradorPendiente {
  id: number
  titulo: string
  actualizado: string
}

export interface FilaPendiente {
  clave: string
  titulo: string
  detalle: string
  tipo: 'Mensaje de contacto' | 'Publicación'
  fecha: string
  href: string
  etiquetaDeAccion: string
}

const deMensaje = ({ id, nombre, servicio, recibido }: MensajePendiente): FilaPendiente => ({
  clave: `mensaje-${id}`,
  titulo: nombre,
  detalle: servicio?.trim() || 'Sin servicio indicado',
  tipo: 'Mensaje de contacto',
  fecha: recibido,
  href: rutaDeMensajes({ mensaje: id }),
  etiquetaDeAccion: `Ver el mensaje de ${nombre}`,
})

const deBorrador = ({ id, titulo, actualizado }: BorradorPendiente): FilaPendiente => ({
  clave: `borrador-${id}`,
  titulo,
  detalle: 'Borrador sin publicar',
  tipo: 'Publicación',
  fecha: actualizado,
  href: documentoEnAdmin('publicaciones', id),
  etiquetaDeAccion: `Ver el borrador «${titulo}»`,
})

export function filasPendientes(
  mensajes: readonly MensajePendiente[],
  borradores: readonly BorradorPendiente[],
): FilaPendiente[] {
  return [...mensajes.map(deMensaje), ...borradores.map(deBorrador)]
    .sort((a, b) => Date.parse(b.fecha) - Date.parse(a.fecha))
    .slice(0, LIMITE_DE_PENDIENTES)
}
