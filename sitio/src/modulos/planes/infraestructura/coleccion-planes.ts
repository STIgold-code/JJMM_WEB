import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoOrden } from '@/compartido/infraestructura/campos/campos-comunes'

import { validarSinMontos } from './validaciones-de-planes'

// Planes de outsourcing contable. No tienen campo de precio: el sitio muestra «Consultar» (S9).
// Lo que incluye cada plan está en `inclusiones-de-plan`.
export const coleccionPlanes: CollectionConfig = {
  slug: 'planes',
  labels: { singular: 'Plan', plural: 'Planes' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'destacado', 'orden'],
    group: 'Inicio',
  },
  defaultSort: 'orden',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    {
      name: 'nombre',
      label: 'Nombre',
      type: 'text',
      required: true,
      unique: true,
      validate: validarSinMontos,
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      validate: validarSinMontos,
    },
    {
      name: 'destacado',
      label: 'Destacado',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    {
      name: 'mensajeDeConsulta',
      label: 'Mensaje de WhatsApp para solicitarlo',
      type: 'text',
      admin: { description: 'Por ejemplo «Hola, quiero información del plan Emprende.»' },
    },
    campoOrden(),
  ],
}
