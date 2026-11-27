import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoOrden } from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

import { validarSinMontos } from './validaciones-de-planes'

// Planes de outsourcing contable. No tienen campo de precio: el sitio muestra «Consultar» (S9).
// Lo que incluye cada plan está en `inclusiones-de-plan`.
export const coleccionPlanes: CollectionConfig = {
  slug: 'planes',
  labels: { singular: 'Plan', plural: 'Planes' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'destacado', 'orden'],
    listSearchableFields: ['nombre'],
    group: GRUPOS_DEL_PANEL.inicio,
    description:
      'Columnas de la tabla «Nuestros planes» del inicio. Nunca se publican montos: en lugar del precio se muestra «Consultar», y el panel no acepta textos con montos.',
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
      admin: { placeholder: 'SIGEMype I' },
    },
    {
      name: 'descripcion',
      label: 'Descripción',
      type: 'textarea',
      validate: validarSinMontos,
      admin: {
        description: 'Opcional y sin montos. Por ahora el sitio no muestra esta descripción.',
      },
    },
    {
      name: 'destacado',
      label: 'Destacado',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Por ahora el sitio no usa esta marca: la tabla muestra todos los planes igual.',
      },
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
