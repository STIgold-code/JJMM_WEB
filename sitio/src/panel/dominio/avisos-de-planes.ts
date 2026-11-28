import type { Aviso } from './respuesta-al-mensaje'

// Avisos breves tras escribir un plan, con el texto de la maqueta aprobada.
export function avisoDeVisibilidad(nombre: string, visible: boolean): Aviso {
  return {
    titulo: visible
      ? `El plan ${nombre} ya se ve en el sitio`
      : `El plan ${nombre} quedó oculto en el sitio`,
    detalle: 'Puedes cambiarlo cuando quieras.',
  }
}

export function avisoDeOrden(nombre: string, posicion: number): Aviso {
  return { titulo: 'Orden actualizado', detalle: `${nombre} quedó en la posición ${posicion}.` }
}

export const AVISO_DE_PLAN_GUARDADO: Aviso = {
  titulo: 'Cambios guardados',
  detalle: 'La tabla «Nuestros planes» ya muestra los cambios.',
}

export function avisoDePlanCreado(nombre: string): Aviso {
  return {
    titulo: `Plan ${nombre} creado`,
    detalle: 'Elige qué incluye y márcalo como visible cuando esté listo.',
  }
}

export function avisoDePlanEliminado(nombre: string): Aviso {
  return { titulo: 'Plan eliminado', detalle: `Se borró ${nombre} con todo lo que incluía.` }
}
