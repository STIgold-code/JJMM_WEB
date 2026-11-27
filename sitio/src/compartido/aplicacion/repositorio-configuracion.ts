import type { ConfiguracionDelSitio } from '../dominio/configuracion-del-sitio'

// Devuelve null si la configuración todavía no se guardó en el panel.
export interface RepositorioConfiguracion {
  obtener(): Promise<ConfiguracionDelSitio | null>
}
