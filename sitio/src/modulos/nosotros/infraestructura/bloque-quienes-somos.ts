import type { Block } from 'payload'

import { camposDeSeccion } from '@/compartido/infraestructura/campos/campos-de-seccion'

// «Quiénes somos»: cifras publicadas por el estudio (solo hechos, S9) y la presentación.
export const bloqueQuienesSomos: Block = {
  slug: 'quienes-somos',
  interfaceName: 'BloqueQuienesSomos',
  labels: { singular: 'Quiénes somos', plural: 'Quiénes somos' },
  fields: [
    ...camposDeSeccion(
      'quienes-somos',
      'Sección «Quiénes somos» del inicio: las cifras del estudio y su presentación.',
    ),
    {
      name: 'cifras',
      label: 'Cifras',
      labels: { singular: 'Cifra', plural: 'Cifras' },
      type: 'array',
      admin: {
        description:
          'Solo cifras reales y comprobables del estudio, por ejemplo «Más de» 100 «clientes». No publiques cifras estimadas.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'prefijo', label: 'Antes del número', type: 'text', defaultValue: 'Más de' },
            { name: 'valor', label: 'Número', type: 'number', required: true, min: 0 },
            { name: 'sufijo', label: 'Después del número', type: 'text' },
          ],
        },
        { name: 'descripcion', label: 'Descripción', type: 'text', required: true },
      ],
    },
    { name: 'presentacion', label: 'Presentación', type: 'richText', required: true },
  ],
}
