import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'

import { validarTextoDeLaCelda } from './validaciones-de-planes'

// Celdas de la matriz: qué incluye cada plan en cada característica. Una sola celda por par
// plan + característica, garantizada por un índice único en la base de datos.
export const coleccionInclusionesDePlan: CollectionConfig = {
  slug: 'inclusiones-de-plan',
  labels: { singular: 'Inclusión de plan', plural: 'Inclusiones de plan' },
  admin: {
    defaultColumns: ['plan', 'caracteristica', 'tipo', 'texto'],
    group: 'Inicio',
    description:
      'Una fila por cada plan y característica. Lo que falte se muestra como no incluido.',
  },
  access: ACCESO_DE_CONTENIDO,
  indexes: [{ fields: ['plan', 'caracteristica'], unique: true }],
  fields: [
    {
      name: 'plan',
      label: 'Plan',
      type: 'relationship',
      relationTo: 'planes',
      required: true,
      index: true,
    },
    {
      name: 'caracteristica',
      label: 'Característica',
      type: 'relationship',
      relationTo: 'caracteristicas-de-plan',
      required: true,
    },
    {
      name: 'tipo',
      label: 'Valor',
      type: 'select',
      required: true,
      defaultValue: 'incluido',
      options: [
        { value: 'incluido', label: 'Incluido' },
        { value: 'no-incluido', label: 'No incluido' },
        { value: 'texto', label: 'Texto (por ejemplo «2 trabajadores» o «Consultar»)' },
      ],
    },
    {
      name: 'texto',
      label: 'Texto de la celda',
      type: 'text',
      validate: validarTextoDeLaCelda,
    },
  ],
}
