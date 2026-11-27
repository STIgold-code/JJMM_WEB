import type { Field } from 'payload'

import { validarDestino } from '../../dominio/destino-de-enlace'
import { comoTexto } from './validaciones'

const validarAncla = (valor: unknown): true | string =>
  comoTexto(valor) === '' ||
  validarDestino('seccion', `#${comoTexto(valor)}`) === null ||
  'Usa minúsculas, números y guiones, sin #. Por ejemplo «planes».'

// Campos comunes a todo bloque de sección: el ancla para el menú (#planes), el título y una
// bajada opcional. Payload no admite una descripción propia en los bloques, así que
// `queMuestra` (qué muestra la sección y dónde se edita su contenido) va como ayuda del título.
export function camposDeSeccion(anclaPorDefecto: string, queMuestra: string): Field[] {
  return [
    {
      name: 'ancla',
      label: 'Ancla',
      type: 'text',
      defaultValue: anclaPorDefecto,
      validate: validarAncla,
      admin: {
        placeholder: anclaPorDefecto || undefined,
        description:
          'Opcional. Nombre corto para que el menú lleve a esta sección, sin #. Si lo cambias, actualiza también el «Menú principal».',
      },
    },
    {
      name: 'titulo',
      label: 'Título',
      type: 'text',
      required: true,
      admin: { description: queMuestra },
    },
    {
      name: 'bajada',
      label: 'Bajada',
      type: 'textarea',
      admin: { description: 'Opcional. Texto corto que aparece debajo del título.' },
    },
  ]
}
