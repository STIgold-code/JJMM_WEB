import type { Block } from 'payload'

import { camposDeSeccion } from '@/compartido/infraestructura/campos/campos-de-seccion'

import { validarSinMontos } from './validaciones-de-planes'

// «Nuestros planes»: la matriz sale de `planes`, `caracteristicas-de-plan` e
// `inclusiones-de-plan`. Sin precios (S9).
export const bloquePlanes: Block = {
  slug: 'planes',
  interfaceName: 'BloquePlanes',
  labels: { singular: 'Planes', plural: 'Planes' },
  fields: [
    ...camposDeSeccion(
      'planes',
      'Sección «Nuestros planes» del inicio: la tabla comparativa. Los planes, sus características y lo que incluye cada uno se editan en el grupo Inicio. Nunca muestra precios: cada plan dice «Consultar».',
    ),
    {
      name: 'encabezadoDeCaracteristicas',
      label: 'Encabezado de la columna de características',
      type: 'text',
      required: true,
      defaultValue: 'Qué incluye',
    },
    {
      name: 'textoDelBoton',
      label: 'Texto del botón de cada plan',
      type: 'text',
      required: true,
      defaultValue: 'Solicitar',
    },
    {
      name: 'notaAlPie',
      label: 'Nota al pie de la tabla',
      type: 'text',
      validate: validarSinMontos,
      admin: { description: 'Opcional. Sin montos ni precios.' },
    },
  ],
}
