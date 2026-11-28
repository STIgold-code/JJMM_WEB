import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoOrden } from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

import { borrarInclusionesDeLaCaracteristica } from './borrar-inclusiones-de-la-caracteristica'
import { validarSinMontos } from './validaciones-de-planes'

// Filas de la matriz de planes («Libro Bancos mensual», «Manejo de Kardex»…). Borrar una fila
// borra antes sus celdas en todos los planes, en la misma transacción.
export const coleccionCaracteristicasDePlan: CollectionConfig = {
  slug: 'caracteristicas-de-plan',
  labels: { singular: 'Característica de plan', plural: 'Características de plan' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'orden'],
    listSearchableFields: ['nombre'],
    group: GRUPOS_DEL_PANEL.inicio,
    description:
      'Filas de la tabla «Nuestros planes», por ejemplo «Libro Bancos mensual». Qué plan incluye cada una se marca en «Inclusiones de plan». Sin montos ni precios.',
  },
  defaultSort: 'orden',
  access: ACCESO_DE_CONTENIDO,
  hooks: { beforeDelete: [borrarInclusionesDeLaCaracteristica] },
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
