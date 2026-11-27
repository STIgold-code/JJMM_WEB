import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from './acceso'
import { GRUPOS_DEL_PANEL } from './panel/grupos-del-panel'

// Imágenes y archivos que usan todos los módulos. Con Wasabi configurado se guardan allí;
// sin él, en la carpeta local `media/` (ignorada por git), solo para desarrollo.
export const coleccionMedios: CollectionConfig = {
  slug: 'medios',
  labels: { singular: 'Medio', plural: 'Medios' },
  admin: {
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    listSearchableFields: ['filename', 'alt'],
    group: GRUPOS_DEL_PANEL.sitio,
    description:
      'Imágenes que usa el sitio: portadas, logotipos, fotos del blog. Sube aquí una imagen o hazlo directamente desde el campo donde la necesites.',
  },
  access: ACCESO_DE_CONTENIDO,
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
      admin: {
        description:
          'Describe en una frase lo que muestra la imagen, para quien no puede verla y para Google. Por ejemplo «Rueda del sistema SIGE Mype con sus nueve áreas».',
      },
    },
  ],
  upload: {
    staticDir: 'media',
  },
}
