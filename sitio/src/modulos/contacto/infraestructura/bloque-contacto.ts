import type { Block, Field } from 'payload'

import { camposDeSeccion } from '@/compartido/infraestructura/campos/campos-de-seccion'

const camposDelFormulario: Field[] = [
  { name: 'titulo', label: 'Título', type: 'text', required: true },
  { name: 'texto', label: 'Texto', type: 'textarea' },
  { name: 'textoDelBoton', label: 'Texto del botón', type: 'text', required: true },
  {
    name: 'opcionesDeServicio',
    label: 'Opciones de «¿Qué necesitas?»',
    labels: { singular: 'Opción', plural: 'Opciones' },
    type: 'array',
    minRows: 1,
    fields: [{ name: 'texto', label: 'Texto', type: 'text', required: true }],
  },
]

// WhatsApp, llamada, dirección y mapa salen de cada sede; aquí van los textos y la foto comunes.
const camposDeCanales: Field[] = [
  {
    name: 'comoLlegar',
    label: 'Texto del botón «Cómo llegar»',
    type: 'text',
    defaultValue: 'Cómo llegar',
  },
  {
    name: 'botonDelMapa',
    label: 'Texto del botón del mapa',
    type: 'text',
    defaultValue: 'Ver mapa',
  },
  {
    name: 'fotoDelMapa',
    label: 'Foto de fondo del mapa',
    type: 'upload',
    relationTo: 'medios',
    admin: {
      description:
        'Se ve detrás del botón del mapa hasta que la persona lo pulsa; recién entonces se carga Google Maps.',
    },
  },
]

// «Contáctanos» (v5): una pestaña por sede activa (colección `sedes`) y el formulario.
export const bloqueContacto: Block = {
  slug: 'contacto',
  interfaceName: 'BloqueContacto',
  labels: { singular: 'Contacto', plural: 'Contacto' },
  fields: [
    ...camposDeSeccion('contacto'),
    { name: 'formulario', label: 'Formulario', type: 'group', fields: camposDelFormulario },
    { name: 'canales', label: 'Botones de cada sede', type: 'group', fields: camposDeCanales },
  ],
}
