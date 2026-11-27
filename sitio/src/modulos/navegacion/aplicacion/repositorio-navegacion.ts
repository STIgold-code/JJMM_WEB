import type { ItemDeMenuGuardado } from '../dominio/item-de-menu'

// Ítems del menú principal en el orden del panel; lista vacía si el menú no se guardó.
export interface RepositorioNavegacion {
  obtenerItems(): Promise<readonly ItemDeMenuGuardado[]>
}
