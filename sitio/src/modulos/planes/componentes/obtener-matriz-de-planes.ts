import { cache } from 'react'

import { crearObtenerMatrizDePlanes } from '../aplicacion/obtener-matriz-de-planes'
import { repositorioPlanesPayload } from '../infraestructura/repositorio-planes-payload'

// Raíz de composición de la matriz de planes: caso de uso + adaptador de Payload.
export const obtenerMatrizDePlanes = cache(crearObtenerMatrizDePlanes(repositorioPlanesPayload))
