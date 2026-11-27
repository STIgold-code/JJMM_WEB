import type { Block } from 'payload'

import { camposDeSeccion } from '@/compartido/infraestructura/campos/campos-de-seccion'

// «Nuestros servicios»: la rueda SIGE Mype con sus áreas (colección `areas-de-servicio`).
export const bloqueServicios: Block = {
  slug: 'servicios',
  interfaceName: 'BloqueServicios',
  labels: { singular: 'Servicios', plural: 'Servicios' },
  fields: [
    ...camposDeSeccion('servicios'),
    {
      name: 'imagenDeLaRueda',
      label: 'Imagen de la rueda SIGE Mype',
      type: 'upload',
      relationTo: 'medios',
      required: true,
      admin: { description: 'Los gajos de cada área se dibujan sobre esta imagen (500 × 550).' },
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
