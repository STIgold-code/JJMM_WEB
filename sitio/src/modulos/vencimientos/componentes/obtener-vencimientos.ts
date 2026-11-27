import { cache } from 'react'

import { crearListarVencimientos } from '../aplicacion/listar-vencimientos'
import { crearObtenerCronogramaSunat } from '../aplicacion/obtener-cronograma-sunat'
import { repositorioCronogramasSunatPayload } from '../infraestructura/repositorio-cronogramas-sunat-payload'
import { repositorioVencimientosPayload } from '../infraestructura/repositorio-vencimientos-payload'

// Raíz de composición de los vencimientos: casos de uso + adaptadores de Payload.
export const obtenerVencimientos = cache(crearListarVencimientos(repositorioVencimientosPayload))

export const obtenerCronogramaSunat = crearObtenerCronogramaSunat(
  repositorioCronogramasSunatPayload,
)
