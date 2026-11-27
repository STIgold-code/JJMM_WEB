import { cache } from 'react'

import { crearListarSedes } from '../aplicacion/listar-sedes'
import { repositorioSedesPayload } from '../infraestructura/repositorio-sedes-payload'

// Raíz de composición de las sedes: caso de uso + adaptador de Payload.
export const obtenerSedesDelSitio = cache(crearListarSedes(repositorioSedesPayload))
