import type { SedeGuardada } from '../dominio/sede'
import type { SedeDeContactoGuardada } from '../dominio/sede-de-contacto'

// Sedes activas en el orden del panel.
export interface RepositorioSedes {
  listarActivas(): Promise<readonly SedeGuardada[]>
}

// Sedes activas con lo que necesita «Contáctanos» (WhatsApp por celular y mapa), en el orden
// del panel. Separado de `RepositorioSedes`: el pie y los datos estructurados no lo usan.
export interface RepositorioSedesDeContacto {
  listarParaContacto(): Promise<readonly SedeDeContactoGuardada[]>
}
