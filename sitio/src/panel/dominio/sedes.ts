import type { Rol } from '@/compartido/dominio/roles'

import type { Aviso } from './respuesta-al-mensaje'
import { RUTA_DEL_INICIO } from './rutas-del-panel'

// Sedes en el panel: cada sede visible aparece en el pie del sitio, como una pestaña de
// «Contáctanos» y en los datos para Google (JSON-LD). Su orden es el de las pestañas.
export const RUTA_DE_SEDES = `${RUTA_DEL_INICIO}/sedes`
export const RUTA_DE_NUEVA_SEDE = `${RUTA_DE_SEDES}/nueva`

export function rutaDeLaSede(id: number): string {
  return `${RUTA_DE_SEDES}/${id}`
}

export interface CelularDelPanel {
  numero: string
  tieneWhatsApp: boolean
}

export interface SedeDelPanel {
  id: number
  nombre: string
  direccion: string
  distrito: string
  ciudad: string
  celulares: CelularDelPanel[]
  correo: string | null
  mapa: string | null
  visible: boolean
  orden: number
}

// «Sede San Isidro» → «San Isidro», para no escribir «la sede Sede San Isidro».
export function nombreCorto(nombre: string): string {
  return nombre.trim().replace(/^sede\s+/i, '')
}

export function direccionCompleta(
  sede: Pick<SedeDelPanel, 'direccion' | 'distrito' | 'ciudad'>,
): string {
  return [sede.direccion, sede.distrito, sede.ciudad]
    .map((parte) => parte.trim())
    .filter(Boolean)
    .join(', ')
}

// Dato secundario de la fila del listado.
export function secundarioDeSede(
  sede: Pick<SedeDelPanel, 'direccion' | 'distrito' | 'ciudad' | 'mapa'>,
): string {
  const direccion = direccionCompleta(sede)
  return sede.mapa ? direccion : `${direccion} · sin mapa insertado`
}

// El sitio funciona sin sedes (el pie y «Contáctanos» quedan sin ellas y el JSON-LD sin
// dirección), así que dejarlo sin ninguna visible se permite, pero con este aviso.
export const SIN_SEDES_VISIBLES =
  'el pie y «Contáctanos» se quedarán sin sedes y Google dejará de recibir la dirección del estudio.'
export const AVISO_DE_ULTIMA_VISIBLE = `Es la única sede visible: ${SIN_SEDES_VISIBLES}`

// Ocultarla o borrarla deja el sitio sin ninguna sede visible.
export function esLaUltimaVisible(
  sedes: readonly Pick<SedeDelPanel, 'id' | 'visible'>[],
  id: number,
): boolean {
  const visibles = sedes.filter((sede) => sede.visible)
  return visibles.length === 1 && visibles[0]?.id === id
}

// Igual que los planes y los mensajes (L4 e): solo el administrador borra. La colección deja
// borrar al equipo, así que esta regla decide si el botón se muestra y la acción lo rechaza antes.
export function puedeEliminarSedes(rol: Rol): boolean {
  return rol === 'administrador'
}

// Avisos breves tras escribir una sede, con el texto de la maqueta aprobada.
export function avisoDeVisibilidadDeSede(nombre: string, visible: boolean): Aviso {
  const corto = nombreCorto(nombre)
  return {
    titulo: visible
      ? `La sede ${corto} ya se ve en el sitio`
      : `La sede ${corto} quedó oculta en el sitio`,
    detalle: 'Puedes cambiarlo cuando quieras.',
  }
}

export function avisoDeSedeGuardada(visible: boolean): Aviso {
  return {
    titulo: 'Cambios guardados',
    detalle: visible
      ? 'El pie y «Contáctanos» ya muestran los cambios.'
      : 'La sede está oculta: no se muestra en el sitio.',
  }
}

export function avisoDeSedeCreada(nombre: string, visible: boolean): Aviso {
  return {
    titulo: `${nombre} creada`,
    detalle: visible
      ? 'Ya se ve en el pie y en «Contáctanos».'
      : 'Quedó oculta: enciende «Visible en el sitio» cuando esté lista.',
  }
}

export function avisoDeSedeEliminada(nombre: string): Aviso {
  return { titulo: 'Sede eliminada', detalle: `Se borró ${nombre}.` }
}
