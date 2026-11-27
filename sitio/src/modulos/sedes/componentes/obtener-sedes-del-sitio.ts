import { cache } from 'react'

import { crearListarSedes } from '../aplicacion/listar-sedes'
import { crearListarSedesDeContacto } from '../aplicacion/listar-sedes-de-contacto'
import {
  repositorioSedesDeContactoPayload,
  repositorioSedesPayload,
} from '../infraestructura/repositorio-sedes-payload'

// Raíz de composición de las sedes: caso de uso + adaptador de Payload.
export const obtenerSedesDelSitio = cache(crearListarSedes(repositorioSedesPayload))

// Sedes de «Contáctanos», con el mensaje de WhatsApp del sitio.
export const obtenerSedesDeContacto = cache(
  crearListarSedesDeContacto(repositorioSedesDeContactoPayload),
)
