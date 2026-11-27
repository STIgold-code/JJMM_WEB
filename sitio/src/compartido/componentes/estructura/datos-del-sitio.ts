import { cache } from 'react'

import { crearObtenerDatosDelSitio } from '@/compartido/aplicacion/obtener-datos-del-sitio'
import { repositorioConfiguracionPayload } from '@/compartido/infraestructura/repositorio-configuracion-payload'

// Raíz de composición: une el caso de uso con su adaptador de Payload. `cache` evita leer
// la configuración varias veces en una misma petición (layout, metadatos y cada pieza).
export const obtenerDatosDelSitio = cache(
  crearObtenerDatosDelSitio(repositorioConfiguracionPayload),
)
