import { cache } from 'react'

import { crearListarValores } from '../aplicacion/listar-valores'
import { repositorioValoresPayload } from '../infraestructura/repositorio-valores-payload'

// Raíz de composición de los valores: caso de uso + adaptador de Payload.
export const obtenerValores = cache(crearListarValores(repositorioValoresPayload))
