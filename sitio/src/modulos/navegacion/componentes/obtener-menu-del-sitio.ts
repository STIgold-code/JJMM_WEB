import { cache } from 'react'

import { crearObtenerMenu } from '../aplicacion/obtener-menu'
import { repositorioNavegacionPayload } from '../infraestructura/repositorio-navegacion-payload'

// Raíz de composición del menú: caso de uso + adaptador de Payload, una lectura por petición.
export const obtenerMenuDelSitio = cache(crearObtenerMenu(repositorioNavegacionPayload))
