import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoSlug } from '@/compartido/infraestructura/campos/campos-comunes'

// Categorías del blog (/blog/categoria/<slug>). Cada publicación tiene una.
export const coleccionCategorias: CollectionConfig = {
  slug: 'categorias',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  admin: { useAsTitle: 'nombre', defaultColumns: ['nombre', 'slug'], group: 'Blog' },
  defaultSort: 'nombre',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, unique: true },
    campoSlug('nombre'),
  ],
}
