import type { SedeGuardada } from '../dominio/sede'

// Sedes activas en el orden del panel.
export interface RepositorioSedes {
  listarActivas(): Promise<readonly SedeGuardada[]>
}
