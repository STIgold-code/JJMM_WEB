import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import {
  campoActivo,
  campoCelular,
  campoOrden,
} from '@/compartido/infraestructura/campos/campos-comunes'
import { validarUrlHttpsOpcional } from '@/compartido/infraestructura/campos/validaciones'

// Sedes del estudio (cabecera, contacto y pie). Solo se publican celulares (S9).
export const coleccionSedes: CollectionConfig = {
  slug: 'sedes',
  labels: { singular: 'Sede', plural: 'Sedes' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'distrito', 'orden', 'activo'],
    group: 'Sitio',
  },
  defaultSort: 'orden',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'direccion', label: 'Dirección', type: 'text', required: true },
    { name: 'distrito', label: 'Distrito', type: 'text', required: true },
    { name: 'ciudad', label: 'Ciudad', type: 'text', required: true, defaultValue: 'Lima' },
    {
      name: 'celulares',
      label: 'Celulares',
      labels: { singular: 'Celular', plural: 'Celulares' },
      type: 'array',
      minRows: 1,
      fields: [
        campoCelular('numero', 'Número'),
        { name: 'tieneWhatsApp', label: 'Atiende por WhatsApp', type: 'checkbox' },
      ],
    },
    { name: 'correo', label: 'Correo', type: 'email' },
    {
      name: 'enlaceDeMapa',
      label: 'Enlace del mapa',
      type: 'text',
      validate: validarUrlHttpsOpcional,
      admin: { description: 'Dirección https:// de Google Maps u otro servicio de mapas.' },
    },
    campoOrden(),
    campoActivo('Activa'),
  ],
}
