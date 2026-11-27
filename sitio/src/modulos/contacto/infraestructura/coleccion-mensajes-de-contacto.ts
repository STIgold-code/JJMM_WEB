import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { accesoPublico, soloAdministradores, soloEquipo } from '@/compartido/infraestructura/acceso'
import { validarCelularOpcional } from '@/compartido/infraestructura/campos/validaciones'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

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
    defaultColumns: ['nombre', 'estado', 'servicioDeInteres', 'createdAt'],
    listSearchableFields: ['nombre', 'mensaje', 'servicioDeInteres', 'celular', 'correo'],
    group: GRUPOS_DEL_PANEL.contacto,
    description:
      'Mensajes que llegan desde el formulario «Contáctanos» del sitio, los más recientes primero. Cuando respondas uno, anota el celular o el correo de la persona y cámbialo a «Atendido».',
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
      admin: {
        placeholder: '951 965 242',
        description:
          'Opcional. El formulario no lo pide: anótalo al responder, por ejemplo por WhatsApp. Solo celulares peruanos de 9 dígitos.',
      },
    },
    {
      name: 'correo',
      label: 'Correo',
      type: 'email',
      admin: {
        description: 'Opcional. El formulario no lo pide: anótalo si la persona te lo da.',
      },
    },
    {
      name: 'servicioDeInteres',
      label: 'Servicio de interés',
      type: 'text',
      maxLength: 120,
      admin: { description: 'Lo que la persona eligió en «¿Qué necesitas?» del formulario.' },
    },
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
      admin: {
        position: 'sidebar',
        description:
          'Todo mensaje llega como «Nuevo». Cámbialo a «Atendido» cuando ya lo respondiste; así el inicio del panel cuenta solo los pendientes.',
      },
    },
  ],
}
