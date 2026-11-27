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

// Los números y el correo salen de la configuración del sitio; aquí solo sus títulos.
const camposDeCanales: Field[] = [
  { name: 'whatsapp', label: 'Título de WhatsApp', type: 'text', defaultValue: 'WhatsApp' },
  { name: 'llamada', label: 'Título de la llamada', type: 'text', defaultValue: 'Llámanos' },
  { name: 'correo', label: 'Título del correo', type: 'text', defaultValue: 'Correo' },
  {
    name: 'botonDelMapa',
    label: 'Texto del botón del mapa',
    type: 'text',
    defaultValue: 'Ver mapa',
  },
]

// «Contáctanos»: formulario, canales (de la configuración del sitio) y mapa de una sede.
export const bloqueContacto: Block = {
  slug: 'contacto',
  interfaceName: 'BloqueContacto',
  labels: { singular: 'Contacto', plural: 'Contacto' },
  fields: [
    ...camposDeSeccion('contacto'),
    { name: 'formulario', label: 'Formulario', type: 'group', fields: camposDelFormulario },
    { name: 'canales', label: 'Canales', type: 'group', fields: camposDeCanales },
    {
      name: 'sedeDelMapa',
      label: 'Sede que se muestra en el mapa',
      type: 'relationship',
      relationTo: 'sedes',
    },
  ],
}
