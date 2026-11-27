import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoOrden } from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

// Obligaciones y cuándo vencen, como texto en la guía de clientes (S7).
// Las fechas exactas por dígito del RUC están en `cronogramas-sunat`.
export const coleccionVencimientos: CollectionConfig = {
  slug: 'vencimientos',
  labels: { singular: 'Vencimiento', plural: 'Vencimientos' },
  admin: {
    useAsTitle: 'obligacion',
    defaultColumns: ['obligacion', 'periodicidad', 'orden'],
    listSearchableFields: ['obligacion'],
    group: GRUPOS_DEL_PANEL.guia,
    description:
      'Obligaciones mensuales y anuales de la Guía de clientes (/guia), con cuándo vence cada una, explicado en palabras. Las fechas exactas van en «Cronogramas de SUNAT».',
  },
  defaultSort: 'orden',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    { name: 'obligacion', label: 'Obligación', type: 'text', required: true },
    {
      name: 'periodicidad',
      label: 'Periodicidad',
      type: 'select',
      required: true,
      options: [
        { value: 'mensual', label: 'Mensual' },
        { value: 'anual', label: 'Anual' },
      ],
    },
    {
      name: 'cuandoVence',
      label: 'Cuándo vence',
      type: 'text',
      required: true,
      admin: { description: 'Por ejemplo «Según el último dígito del RUC».' },
    },
    { name: 'nota', label: 'Nota', type: 'textarea' },
    campoOrden(),
  ],
}
