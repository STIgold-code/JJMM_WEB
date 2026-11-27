import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoOrden } from '@/compartido/infraestructura/campos/campos-comunes'

// Íconos disponibles en el sitio. Son símbolos SVG del código, por eso la lista es cerrada.
const ICONOS = [
  { value: 'pulgar', label: 'Pulgar arriba' },
  { value: 'trofeo', label: 'Trofeo' },
  { value: 'foco', label: 'Foco' },
  { value: 'candado', label: 'Candado' },
  { value: 'balanza', label: 'Balanza' },
  { value: 'equipo', label: 'Equipo' },
]

// Valores de la sección «¿Por qué elegirnos?».
export const coleccionValores: CollectionConfig = {
  slug: 'valores',
  labels: { singular: 'Valor', plural: 'Valores' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'icono', 'orden'],
    group: 'Inicio',
  },
  defaultSort: 'orden',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'icono', label: 'Ícono', type: 'select', required: true, options: ICONOS },
    campoOrden(),
  ],
}
