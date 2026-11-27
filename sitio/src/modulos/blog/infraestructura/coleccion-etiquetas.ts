import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoSlug } from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

// Colores de etiqueta. Lista cerrada: cada color tiene su par de tokens con contraste AA en el
// CSS, cosa que un color libre no garantiza.
const COLORES = [
  { value: 'azul', label: 'Azul' },
  { value: 'verde', label: 'Verde' },
  { value: 'rojo', label: 'Rojo' },
  { value: 'amarillo', label: 'Amarillo' },
  { value: 'morado', label: 'Morado' },
  { value: 'gris', label: 'Gris' },
]

// Etiquetas del blog (/blog/etiqueta/<slug>). Una publicación puede tener varias.
export const coleccionEtiquetas: CollectionConfig = {
  slug: 'etiquetas',
  labels: { singular: 'Etiqueta', plural: 'Etiquetas' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'slug', 'color'],
    listSearchableFields: ['nombre', 'slug'],
    group: GRUPOS_DEL_PANEL.blog,
    description:
      'Palabras clave del blog, por ejemplo «IGV». Una publicación puede tener varias; cada etiqueta tiene su página en /blog/etiqueta/….',
  },
  defaultSort: 'nombre',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, unique: true },
    campoSlug('nombre'),
    {
      name: 'color',
      label: 'Color',
      type: 'select',
      required: true,
      defaultValue: 'azul',
      options: COLORES,
    },
  ],
}
