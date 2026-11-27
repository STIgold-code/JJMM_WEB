import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

import { ROLES, rolDelNuevoUsuario } from '@/compartido/dominio/roles'
import {
  administradorOElMismoUsuario,
  soloAdministradores,
} from '@/compartido/infraestructura/acceso'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

const SLUG = 'usuarios'

// El primer usuario (creado desde la pantalla inicial del panel) queda como administrador.
const asignarRolInicial: CollectionBeforeChangeHook = async ({ data, operation, req }) => {
  if (operation !== 'create') return data
  const { totalDocs } = await req.payload.count({ collection: SLUG, req })
  const rolSolicitado = ROLES.find((rol) => rol === data.rol)
  return { ...data, rol: rolDelNuevoUsuario(totalDocs, rolSolicitado) }
}

// Cuentas que acceden al panel. Payload agrega el correo y la contraseña al activar `auth`.
// El administrador gestiona usuarios y configuración; el editor, el contenido.
export const coleccionUsuarios: CollectionConfig = {
  slug: SLUG,
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'nombre', 'rol'],
    listSearchableFields: ['email', 'nombre'],
    group: GRUPOS_DEL_PANEL.administracion,
    description:
      'Cuentas del panel. La primera cuenta que se crea es la del administrador. El administrador crea las cuentas y edita el menú y la configuración del sitio; un editor cambia el contenido y solo ve su propia cuenta.',
  },
  auth: true,
  access: {
    read: administradorOElMismoUsuario,
    create: soloAdministradores,
    update: administradorOElMismoUsuario,
    delete: soloAdministradores,
    // Sin esto, Payload deja que cualquier usuario del panel desbloquee cualquier cuenta.
    unlock: soloAdministradores,
  },
  hooks: { beforeChange: [asignarRolInicial] },
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text' },
    {
      name: 'rol',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { value: 'administrador', label: 'Administrador' },
        { value: 'editor', label: 'Editor' },
      ],
      // Un editor no puede cambiarse el rol a sí mismo.
      access: { create: soloAdministradores, update: soloAdministradores },
      admin: {
        position: 'sidebar',
        description:
          'Administrador: todo el panel, incluidas las cuentas, el menú principal y la configuración del sitio. Editor: textos, imágenes, planes, avisos, blog, sedes y mensajes; no puede crear cuentas, borrar mensajes ni cambiar su propio rol.',
      },
    },
  ],
}
