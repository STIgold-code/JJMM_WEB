import { esUrlHttps } from '@/compartido/dominio/destino-de-enlace'
import type { Sede } from '@/payload-types'

export interface SedeDelMapa {
  nombre: string
  direccion: string
  enlaceDeMapa: string | null
}

// La sede llega poblada (profundidad 1) o como id si no se pudo leer. Una sede inactiva no se
// muestra; un enlace de mapa que no es https:// no se publica.
export function mapearSedeDelMapa(sede: number | Sede | null | undefined): SedeDelMapa | null {
  if (!sede || typeof sede === 'number' || sede.activo === false) return null
  const enlace = sede.enlaceDeMapa?.trim() ?? ''
  return {
    nombre: sede.nombre,
    direccion: sede.direccion,
    enlaceDeMapa: esUrlHttps(enlace) ? enlace : null,
  }
}
