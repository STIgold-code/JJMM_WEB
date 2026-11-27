import type { Block } from 'payload'

import { camposDeSeccion } from '@/compartido/infraestructura/campos/campos-de-seccion'

// «¿Por qué elegirnos?». Los valores se editan en la colección `valores`.
export const bloquePorQueElegirnos: Block = {
  slug: 'por-que-elegirnos',
  interfaceName: 'BloquePorQueElegirnos',
  labels: { singular: '¿Por qué elegirnos?', plural: '¿Por qué elegirnos?' },
  fields: camposDeSeccion(''),
}
