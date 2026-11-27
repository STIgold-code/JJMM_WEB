import type { CollectionConfig } from 'payload'

import { publicadoOEquipo, soloEquipo } from '@/compartido/infraestructura/acceso'
import { campoSeo, campoSlug } from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

// Artículos del blog. Usan borradores de Payload: el público solo lee lo publicado.
// No hay comentarios (decisión L10).
export const coleccionPublicaciones: CollectionConfig = {
  slug: 'publicaciones',
  labels: { singular: 'Publicación', plural: 'Publicaciones' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', '_status', 'fechaDePublicacion', 'categoria'],
    listSearchableFields: ['titulo', 'extracto'],
    group: GRUPOS_DEL_PANEL.blog,
    description:
      'Artículos del blog (/blog). «Guardar borrador» guarda tu trabajo sin mostrarlo al público; solo se ve en el sitio cuando pulsas «Publicar cambios». Para retirar uno ya publicado, usa «Despublicar».',
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
    {
      name: 'imagen',
      label: 'Imagen principal',
      type: 'upload',
      relationTo: 'medios',
      admin: { description: 'Opcional. Se ve en el listado del blog y al abrir el artículo.' },
    },
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
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
        description:
          'La fecha que ven los lectores; el blog ordena por ella, de la más reciente a la más antigua.',
      },
    },
    campoSeo(),
  ],
}
