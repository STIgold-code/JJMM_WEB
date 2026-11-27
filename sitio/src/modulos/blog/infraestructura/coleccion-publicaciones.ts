import type { CollectionConfig } from 'payload'

import { publicadoOEquipo, soloEquipo } from '@/compartido/infraestructura/acceso'
import { campoSeo, campoSlug } from '@/compartido/infraestructura/campos/campos-comunes'

// Artículos del blog. Usan borradores de Payload: el público solo lee lo publicado.
// No hay comentarios (decisión L10).
export const coleccionPublicaciones: CollectionConfig = {
  slug: 'publicaciones',
  labels: { singular: 'Publicación', plural: 'Publicaciones' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'categoria', 'fechaDePublicacion', '_status'],
    group: 'Blog',
  },
  defaultSort: '-fechaDePublicacion',
  access: {
    read: publicadoOEquipo,
    create: soloEquipo,
    update: soloEquipo,
    delete: soloEquipo,
  },
  versions: { drafts: true, maxPerDoc: 20 },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    campoSlug('titulo'),
    {
      name: 'extracto',
      label: 'Extracto',
      type: 'textarea',
      required: true,
      maxLength: 300,
      admin: { description: 'Resumen que aparece en el listado. Máximo 300 caracteres.' },
    },
    { name: 'imagen', label: 'Imagen principal', type: 'upload', relationTo: 'medios' },
    { name: 'contenido', label: 'Contenido', type: 'richText', required: true },
    {
      name: 'categoria',
      label: 'Categoría',
      type: 'relationship',
      relationTo: 'categorias',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'etiquetas',
      label: 'Etiquetas',
      type: 'relationship',
      relationTo: 'etiquetas',
      hasMany: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'fechaDePublicacion',
      label: 'Fecha de publicación',
      type: 'date',
      required: true,
      index: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    campoSeo(),
  ],
}
