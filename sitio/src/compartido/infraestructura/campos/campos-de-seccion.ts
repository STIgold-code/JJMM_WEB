import type { Field } from 'payload'

import { validarDestino } from '../../dominio/destino-de-enlace'
import { comoTexto } from './validaciones'

const validarAncla = (valor: unknown): true | string =>
  comoTexto(valor) === '' ||
  validarDestino('seccion', `#${comoTexto(valor)}`) === null ||
  'Usa minúsculas, números y guiones, sin #. Por ejemplo «planes».'

// Campos comunes a todo bloque de sección: el ancla para el menú (#planes), el título y una
// bajada opcional.
export function camposDeSeccion(anclaPorDefecto: string): Field[] {
  return [
    {
      name: 'ancla',
      label: 'Ancla',
      type: 'text',
      defaultValue: anclaPorDefecto,
      validate: validarAncla,
      admin: {
        description: 'Identificador para enlazar la sección desde el menú, sin #. Opcional.',
      },
    },
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    { name: 'bajada', label: 'Bajada', type: 'textarea' },
  ]
}
