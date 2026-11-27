import type { CollectionConfig } from 'payload'

// Imágenes y archivos que usan todos los módulos. Con Wasabi configurado se guardan allí;
// sin él, en la carpeta local `media/` (ignorada por git), solo para desarrollo.
export const coleccionMedios: CollectionConfig = {
  slug: 'medios',
  labels: { singular: 'Medio', plural: 'Medios' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      label: 'Texto alternativo',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    staticDir: 'media',
  },
}
