import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import {
  campoActivo,
  campoCelular,
  campoOrden,
} from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

import { validarMapaIncrustadoOpcional } from './validar-mapa-incrustado'

// Sedes del estudio (cabecera, contacto y pie). Solo se publican celulares (S9).
export const coleccionSedes: CollectionConfig = {
  slug: 'sedes',
  labels: { singular: 'Sede', plural: 'Sedes' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'distrito', 'orden', 'activo'],
    listSearchableFields: ['nombre', 'distrito', 'direccion'],
    group: GRUPOS_DEL_PANEL.sitio,
    description:
      'Oficinas del estudio. Cada sede activa aparece en la cabecera, en el pie y como una pestaña de «Contáctanos». Desmarca «Activa» para ocultarla sin borrarla.',
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
        {
          name: 'tieneWhatsApp',
          label: 'Atiende por WhatsApp',
          type: 'checkbox',
          admin: { description: 'Márcalo si este celular responde mensajes de WhatsApp.' },
        },
      ],
    },
    { name: 'correo', label: 'Correo', type: 'email' },
    {
      // El nombre del campo se conserva para no migrar datos; guarda el mapa insertado.
      name: 'enlaceDeMapa',
      label: 'Mapa insertado de Google Maps',
      type: 'text',
      validate: validarMapaIncrustadoOpcional,
      admin: {
        placeholder: 'https://www.google.com/maps/embed?pb=…',
        description:
          'Opcional. Busca la sede en Google Maps, pulsa Compartir › Insertar un mapa y copia solo la dirección que está entre comillas después de src=; empieza con https://www.google.com/maps/embed. Un enlace normal de Google Maps no sirve. Se muestra al pulsar «Ver mapa»; si lo dejas vacío, el mapa se busca con la dirección de la sede.',
      },
    },
    campoOrden(),
    campoActivo('Activa'),
  ],
}
