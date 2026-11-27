import { coleccionPublicaciones } from '@/modulos/blog/infraestructura/coleccion-publicaciones'
import { coleccionMensajesDeContacto } from '@/modulos/contacto/infraestructura/coleccion-mensajes-de-contacto'

import type { Pendiente } from '../../componentes/panel/modelo-del-inicio'
import { cantidadConNombre } from '../../componentes/panel/textos-del-inicio'

// Conteos reales del inicio del panel. `null` cuando la cuenta no puede leer esa colección:
// el pendiente no se muestra, nunca se inventa un cero.
export interface ConteosDelInicio {
  mensajesNuevos: number | null
  borradores: number | null
}

type Lista = (slug: string) => string

function mensajesPorResponder(
  { mensajesNuevos }: ConteosDelInicio,
  lista: Lista,
): Pendiente | null {
  if (!mensajesNuevos) return null
  const nombre = cantidadConNombre(mensajesNuevos, 'mensaje nuevo', 'mensajes nuevos')
  return {
    clave: 'mensajes',
    texto: `${mensajesNuevos} ${nombre} por responder`,
    accion: 'Ver los mensajes',
    href: `${lista(coleccionMensajesDeContacto.slug)}?where[estado][equals]=nuevo`,
    icono: 'mensaje',
    urgente: true,
  }
}

function borradoresSinPublicar({ borradores }: ConteosDelInicio, lista: Lista): Pendiente | null {
  if (!borradores) return null
  const nombre = cantidadConNombre(borradores, 'borrador sin publicar', 'borradores sin publicar')
  return {
    clave: 'borradores',
    texto: `${borradores} ${nombre} en el blog`,
    accion: 'Ver las publicaciones',
    href: lista(coleccionPublicaciones.slug),
    icono: 'pluma',
    urgente: false,
  }
}

const PENDIENTES = [mensajesPorResponder, borradoresSinPublicar]

// Lo que pide acción hoy, en orden de urgencia. Lo que está en cero no aparece: las cantidades
// de cada sección ya se ven en «Todo el contenido».
export function armarPendientes(conteos: ConteosDelInicio, rutaDelPanel: string): Pendiente[] {
  const lista: Lista = (slug) => `${rutaDelPanel}/collections/${slug}`
  return PENDIENTES.map((armar) => armar(conteos, lista)).filter(
    (pendiente): pendiente is Pendiente => pendiente !== null,
  )
}
