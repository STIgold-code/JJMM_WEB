import type { Field } from 'payload'

import { TIPOS_DE_DESTINO } from '../../dominio/destino-de-enlace'
import { comoTexto, leerCampo, validarDestinoSegunTipo } from './validaciones'

const ETIQUETAS_DE_DESTINO = {
  seccion: 'Sección de la página (#ancla)',
  interna: 'Página del sitio (/ruta)',
  externa: 'Sitio externo (https://)',
} as const

const OPCIONES_DE_DESTINO = TIPOS_DE_DESTINO.map((value) => ({
  value,
  label: ETIQUETAS_DE_DESTINO[value],
}))

const usaDestino = (_datos: unknown, hermanos: unknown): boolean =>
  TIPOS_DE_DESTINO.some((tipo) => tipo === leerCampo(hermanos, 'tipo'))

function campoDestino(): Field {
  return {
    name: 'destino',
    label: 'Destino',
    type: 'text',
    validate: validarDestinoSegunTipo,
    admin: {
      condition: usaDestino,
      description: 'Por ejemplo #planes, /guia o https://sigefact.pse.pe/.',
    },
  }
}

// Ítem de un menú: sección del inicio, página interna o sitio externo (S7).
export function camposDeEnlace(): Field[] {
  return [
    { name: 'etiqueta', label: 'Etiqueta', type: 'text', required: true },
    {
      name: 'tipo',
      label: 'Tipo de destino',
      type: 'select',
      required: true,
      defaultValue: 'seccion',
      options: OPCIONES_DE_DESTINO,
    },
    campoDestino(),
  ]
}

const OPCIONES_DE_ACCION = [
  { value: 'whatsapp', label: 'Escribir por WhatsApp' },
  { value: 'llamada', label: 'Llamar por teléfono' },
  ...OPCIONES_DE_DESTINO,
]

const esWhatsApp = (_datos: unknown, hermanos: unknown): boolean =>
  comoTexto(leerCampo(hermanos, 'tipo')) === 'whatsapp'

const CAMPO_ESTILO: Field = {
  name: 'estilo',
  label: 'Estilo',
  type: 'select',
  required: true,
  defaultValue: 'principal',
  options: [
    { value: 'principal', label: 'Principal (relleno)' },
    { value: 'secundario', label: 'Secundario (contorno)' },
  ],
}

// Botones de llamada a la acción. WhatsApp y llamada usan los celulares de la configuración
// del sitio, así un cambio de número se hace en un solo lugar.
export function campoAcciones(maximo: number): Field {
  return {
    name: 'acciones',
    label: 'Botones',
    labels: { singular: 'Botón', plural: 'Botones' },
    type: 'array',
    maxRows: maximo,
    fields: [
      { name: 'etiqueta', label: 'Texto del botón', type: 'text', required: true },
      {
        name: 'tipo',
        label: 'Acción',
        type: 'select',
        required: true,
        defaultValue: 'whatsapp',
        options: OPCIONES_DE_ACCION,
      },
      {
        name: 'mensaje',
        label: 'Mensaje de WhatsApp',
        type: 'text',
        admin: {
          condition: esWhatsApp,
          description: 'Si lo dejas vacío, se usa el mensaje por defecto de la configuración.',
        },
      },
      campoDestino(),
      CAMPO_ESTILO,
    ],
  }
}
