import type { ItemDeMenu } from './item-de-menu'

// Valor de aria-current para un ítem: 'true' para la sección visible del inicio (como en
// la v4) y 'page' para la página interna en la que se está. Una sección visible tiene
// prioridad, así «Inicio» no queda marcado mientras se recorren las secciones.
export type EstadoActual = 'true' | 'page' | undefined

function esPaginaActual(href: string, ruta: string): boolean {
  if (href === ruta) return true
  return href !== '/' && ruta.startsWith(`${href}/`)
}

export function estadoActual(
  item: ItemDeMenu,
  seccionActiva: string | null,
  ruta: string,
): EstadoActual {
  if (seccionActiva !== null) return item.seccion === seccionActiva ? 'true' : undefined
  if (item.externo || item.seccion !== null) return undefined
  return esPaginaActual(item.href, ruta) ? 'page' : undefined
}
