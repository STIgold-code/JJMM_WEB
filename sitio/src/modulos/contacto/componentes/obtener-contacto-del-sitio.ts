import { cache } from 'react'

import { repositorioConfiguracionPayload } from '@/compartido/infraestructura/repositorio-configuracion-payload'

import { crearObtenerContacto } from '../aplicacion/obtener-contacto'

// Raíz de composición. Las secciones del inicio arman con estos datos enlaces de WhatsApp con
// su propio mensaje (portadas, servicios, planes, formulario); `cache` hace una sola lectura
// por petición para todas.
export const obtenerContactoDelSitio = cache(crearObtenerContacto(repositorioConfiguracionPayload))
