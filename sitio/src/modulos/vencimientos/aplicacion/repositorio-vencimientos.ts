import type { Vencimiento } from '../dominio/vencimiento'

// Vencimientos de la guía en el orden del panel.
export interface RepositorioVencimientos {
  listar(): Promise<readonly Vencimiento[]>
}
