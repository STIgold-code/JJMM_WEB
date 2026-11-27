import type { Block } from 'payload'

import { camposDeSeccion } from '@/compartido/infraestructura/campos/campos-de-seccion'

// «Nuestros clientes»: carrusel con los logotipos de la colección `clientes`.
export const bloqueClientes: Block = {
  slug: 'clientes',
  interfaceName: 'BloqueClientes',
  labels: { singular: 'Clientes', plural: 'Clientes' },
  fields: camposDeSeccion(
    '',
    'Sección «Nuestros clientes» del inicio. Los logotipos se editan en Inicio › Clientes.',
  ),
}
