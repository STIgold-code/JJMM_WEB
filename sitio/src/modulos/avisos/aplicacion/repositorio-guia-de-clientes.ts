import type { GuiaGuardada } from '../dominio/guia-de-clientes'

// Textos de la página de la guía tal como están en el panel.
export interface RepositorioGuiaDeClientes {
  obtener(): Promise<GuiaGuardada>
}
