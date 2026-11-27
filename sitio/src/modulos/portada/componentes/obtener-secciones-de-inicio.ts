import { cache } from 'react'

import { crearObtenerSeccionesDeInicio } from '../aplicacion/obtener-secciones-de-inicio'
import { repositorioPaginaDeInicioPayload } from '../infraestructura/repositorio-pagina-de-inicio-payload'

// Raíz de composición de la página de inicio: caso de uso + adaptador de Payload.
export const obtenerSeccionesDeInicio = cache(
  crearObtenerSeccionesDeInicio(repositorioPaginaDeInicioPayload),
)
