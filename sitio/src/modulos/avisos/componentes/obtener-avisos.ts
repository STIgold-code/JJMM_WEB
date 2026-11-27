import { cache } from 'react'

import { crearListarAvisos } from '../aplicacion/listar-avisos'
import { crearObtenerGuiaDeClientes } from '../aplicacion/obtener-guia-de-clientes'
import { repositorioAvisosPayload } from '../infraestructura/repositorio-avisos-payload'
import { repositorioGuiaDeClientesPayload } from '../infraestructura/repositorio-guia-de-clientes-payload'

// Raíz de composición de la guía: casos de uso + adaptadores de Payload. `cache` evita
// leer la global dos veces en una petición (metadatos y página).
export const obtenerAvisos = cache(crearListarAvisos(repositorioAvisosPayload))

export const obtenerGuiaDeClientes = cache(
  crearObtenerGuiaDeClientes(repositorioGuiaDeClientesPayload),
)
