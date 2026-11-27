import { cache } from 'react'

import { crearListarAreas } from '../aplicacion/listar-areas'
import { repositorioAreasPayload } from '../infraestructura/repositorio-areas-payload'

// Raíz de composición de las áreas de servicio: caso de uso + adaptador de Payload.
export const obtenerAreas = cache(crearListarAreas(repositorioAreasPayload))
