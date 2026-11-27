import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoSlug } from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

// Categorías del blog (/blog/categoria/<slug>). Cada publicación tiene una.
export const coleccionCategorias: CollectionConfig = {
  slug: 'categorias',
  labels: { singular: 'Categoría', plural: 'Categorías' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'slug'],
    listSearchableFields: ['nombre', 'slug'],
    group: GRUPOS_DEL_PANEL.blog,
    description:
      'Temas del blog, por ejemplo «Tributación». Cada publicación tiene una categoría y cada categoría tiene su página en /blog/categoria/….',
  },
  defaultSort: 'nombre',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, unique: true },
    campoSlug('nombre'),
  ],
}
