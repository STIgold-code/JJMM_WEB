import type { Field, FieldHook } from 'payload'

import { generarSlug } from '../../dominio/slug'
import { comoTexto, leerCampo, validarCelular, validarSlug } from './validaciones'

// Campos que se repiten en varias colecciones, con el mismo nombre y las mismas reglas.

// Orden de aparición en el sitio: menor número, primero. Se usa un número explícito y no
// `orderable` de Payload porque esa opción todavía es experimental.
export function campoOrden(): Field {
  return {
    name: 'orden',
    label: 'Orden',
    type: 'number',
    required: true,
    defaultValue: 0,
    min: 0,
    index: true,
    admin: { position: 'sidebar', description: 'Menor número, primero.' },
  }
}

export function campoActivo(etiqueta: string): Field {
  return {
    name: 'activo',
    label: etiqueta,
    type: 'checkbox',
    defaultValue: true,
    admin: { position: 'sidebar' },
  }
}

const slugDesde =
  (campoOrigen: string): FieldHook =>
  ({ value, siblingData }) =>
    comoTexto(value) || generarSlug(comoTexto(leerCampo(siblingData, campoOrigen)))

// Identificador para la URL. Si queda vacío se genera a partir de `campoOrigen`.
export function campoSlug(campoOrigen: string): Field {
  return {
    name: 'slug',
    label: 'Identificador en la URL',
    type: 'text',
    required: true,
    unique: true,
    index: true,
    hooks: { beforeValidate: [slugDesde(campoOrigen)] },
    validate: validarSlug,
    admin: {
      position: 'sidebar',
      description:
        'Déjalo vacío para generarlo a partir del nombre. Minúsculas, números y guiones.',
    },
  }
}

// SEO propio de una página o publicación. Lo que quede vacío se toma de la configuración.
export function campoSeo(): Field {
  return {
    name: 'seo',
    label: 'SEO',
    type: 'group',
    admin: { description: 'Opcional. Si lo dejas vacío, se usan los datos por defecto.' },
    fields: [
      { name: 'titulo', label: 'Título', type: 'text' },
      { name: 'descripcion', label: 'Descripción', type: 'textarea', maxLength: 160 },
    ],
  }
}

// Celulares publicados (S9): un teléfono fijo no pasa la validación.
export function campoCelular(name: string, label: string): Field {
  return {
    name,
    label,
    type: 'text',
    required: true,
    validate: validarCelular,
    admin: { description: 'Celular de 9 dígitos, por ejemplo 951 965 242.' },
  }
}
