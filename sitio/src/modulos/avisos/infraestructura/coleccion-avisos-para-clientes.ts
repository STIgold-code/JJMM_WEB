import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoActivo, campoOrden } from '@/compartido/infraestructura/campos/campos-comunes'

// Avisos de la guía de clientes (cierre tributario, cierre de planilla…), como texto y no
// como imagen (S7).
export const coleccionAvisosParaClientes: CollectionConfig = {
  slug: 'avisos-para-clientes',
  labels: { singular: 'Aviso para clientes', plural: 'Avisos para clientes' },
  admin: {
    useAsTitle: 'titulo',
    defaultColumns: ['titulo', 'orden', 'activo'],
    group: 'Guía de clientes',
  },
  defaultSort: 'orden',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    {
      name: 'cuandoAplica',
      label: 'Cuándo aplica',
      type: 'textarea',
      required: true,
      admin: { description: 'Por ejemplo «Hasta el 5 de cada mes».' },
    },
    {
      name: 'documentos',
      label: 'Documentos que debes enviar',
      labels: { singular: 'Documento', plural: 'Documentos' },
      type: 'array',
      fields: [{ name: 'texto', label: 'Documento', type: 'text', required: true }],
    },
    { name: 'correoDeContacto', label: 'Correo de contacto', type: 'email' },
    campoOrden(),
    campoActivo('Visible'),
  ],
}
