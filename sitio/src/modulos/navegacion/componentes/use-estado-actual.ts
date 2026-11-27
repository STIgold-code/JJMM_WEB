'use client'

import { usePathname } from 'next/navigation'

import { type EstadoActual, estadoActual } from '../dominio/item-actual'
import type { ItemDeMenu } from '../dominio/item-de-menu'
import { useSeccionActiva } from './use-seccion-activa'

// Calcula el aria-current de cada ítem con la ruta actual y la sección visible del inicio.
export function useEstadoActual(items: readonly ItemDeMenu[]) {
  const ruta = usePathname()
  const secciones = items.flatMap((item) => (item.seccion ? [item.seccion] : []))
  const seccionActiva = useSeccionActiva(secciones)
  return (item: ItemDeMenu): EstadoActual => estadoActual(item, seccionActiva, ruta)
}
