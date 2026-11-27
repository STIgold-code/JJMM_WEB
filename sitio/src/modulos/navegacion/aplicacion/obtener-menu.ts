import { type ItemDeMenu, resolverItemDeMenu } from '../dominio/item-de-menu'
import type { RepositorioNavegacion } from './repositorio-navegacion'

export function crearObtenerMenu(repositorio: RepositorioNavegacion) {
  return async (): Promise<ItemDeMenu[]> => {
    const items = await repositorio.obtenerItems()
    return items.map(resolverItemDeMenu).filter((item): item is ItemDeMenu => item !== null)
  }
}
