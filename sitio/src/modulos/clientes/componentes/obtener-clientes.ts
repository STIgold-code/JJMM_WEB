import { cache } from 'react'

import { crearListarClientes } from '../aplicacion/listar-clientes'
import { repositorioClientesPayload } from '../infraestructura/repositorio-clientes-payload'

// Raíz de composición de los clientes: caso de uso + adaptador de Payload.
export const obtenerClientes = cache(crearListarClientes(repositorioClientesPayload))
