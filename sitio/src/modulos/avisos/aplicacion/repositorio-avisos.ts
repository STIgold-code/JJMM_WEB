import type { AvisoGuardado } from '../dominio/aviso'

// Avisos visibles en el orden del panel.
export interface RepositorioAvisos {
  listarActivos(): Promise<readonly AvisoGuardado[]>
}
