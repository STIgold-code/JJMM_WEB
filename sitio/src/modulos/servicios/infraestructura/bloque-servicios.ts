import type { Block } from 'payload'

import { camposDeSeccion } from '@/compartido/infraestructura/campos/campos-de-seccion'

// «Nuestros servicios»: la rueda SIGE Mype con sus áreas (colección `areas-de-servicio`).
export const bloqueServicios: Block = {
  slug: 'servicios',
  interfaceName: 'BloqueServicios',
  labels: { singular: 'Servicios', plural: 'Servicios' },
  fields: [
    ...camposDeSeccion(
      'servicios',
      'Sección «Nuestros servicios» del inicio: la rueda SIGE Mype. Las áreas se editan en Inicio › Áreas de servicio.',
    ),
    {
      name: 'imagenDeLaRueda',
      label: 'Imagen de la rueda SIGE Mype',
      type: 'upload',
      relationTo: 'medios',
      required: true,
      admin: {
        description:
          'Los gajos de cada área se marcan sobre esta imagen. Si la reemplazas, usa una de 500 × 550 píxeles con la rueda en la misma posición.',
      },
    },
    {
      name: 'textoDelBoton',
      label: 'Texto del botón de cada área',
      type: 'text',
      required: true,
      defaultValue: 'Consultar este servicio',
    },
  ],
}
