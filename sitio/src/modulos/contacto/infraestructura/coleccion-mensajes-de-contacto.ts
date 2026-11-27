import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { accesoPublico, soloAdministradores, soloEquipo } from '@/compartido/infraestructura/acceso'
import { validarCelularOpcional } from '@/compartido/infraestructura/campos/validaciones'

// Un mensaje enviado desde el sitio siempre llega como nuevo, aunque el envío diga otra cosa.
const marcarComoNuevoSiEsPublico: CollectionBeforeChangeHook = ({ data, operation, req }) =>
  operation === 'create' && !req.user ? { ...data, estado: 'nuevo' } : data

// Mensajes del formulario de contacto. Cualquiera puede crearlos; solo el equipo los lee.
// La fecha es `createdAt`, que Payload agrega a toda colección.
export const coleccionMensajesDeContacto: CollectionConfig = {
  slug: 'mensajes-de-contacto',
  labels: { singular: 'Mensaje de contacto', plural: 'Mensajes de contacto' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'servicioDeInteres', 'estado', 'createdAt'],
    group: 'Contacto',
  },
  defaultSort: '-createdAt',
  access: {
    create: accesoPublico,
    read: soloEquipo,
    update: soloEquipo,
    delete: soloAdministradores,
  },
  hooks: { beforeChange: [marcarComoNuevoSiEsPublico] },
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true, maxLength: 120 },
    // El formulario no los pide (v5): los anota el equipo al responder por WhatsApp. Se
    // conservan los de mensajes anteriores.
    {
      name: 'celular',
      label: 'Celular',
      type: 'text',
      validate: validarCelularOpcional,
      admin: { description: 'Lo anota el equipo; el formulario del sitio no lo pide.' },
    },
    {
      name: 'correo',
      label: 'Correo',
      type: 'email',
      admin: { description: 'Lo anota el equipo; el formulario del sitio no lo pide.' },
    },
    { name: 'servicioDeInteres', label: 'Servicio de interés', type: 'text', maxLength: 120 },
    { name: 'mensaje', label: 'Mensaje', type: 'textarea', required: true, maxLength: 2000 },
    {
      name: 'estado',
      label: 'Estado',
      type: 'select',
      required: true,
      defaultValue: 'nuevo',
      index: true,
      options: [
        { value: 'nuevo', label: 'Nuevo' },
        { value: 'atendido', label: 'Atendido' },
      ],
      admin: { position: 'sidebar' },
    },
  ],
}
