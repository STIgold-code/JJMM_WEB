import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoOrden } from '@/compartido/infraestructura/campos/campos-comunes'

import { validarSinMontos } from './validaciones-de-planes'

// Filas de la matriz de planes («Libro Bancos mensual», «Manejo de Kardex»…).
export const coleccionCaracteristicasDePlan: CollectionConfig = {
  slug: 'caracteristicas-de-plan',
  labels: { singular: 'Característica de plan', plural: 'Características de plan' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'orden'],
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
    campoOrden(),
  ],
}
