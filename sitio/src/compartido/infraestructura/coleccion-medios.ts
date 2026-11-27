import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from './acceso'

// Imágenes y archivos que usan todos los módulos. Con Wasabi configurado se guardan allí;
// sin él, en la carpeta local `media/` (ignorada por git), solo para desarrollo.
export const coleccionMedios: CollectionConfig = {
  slug: 'medios',
  labels: { singular: 'Medio', plural: 'Medios' },
  admin: { group: 'Sitio' },
  access: ACCESO_DE_CONTENIDO,
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
      admin: { description: 'Describe la imagen para quien no puede verla.' },
    },
  ],
  upload: {
    staticDir: 'media',
  },
}
