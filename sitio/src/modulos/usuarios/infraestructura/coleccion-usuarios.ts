import type { CollectionConfig } from 'payload'

// Cuentas que acceden al panel. Payload agrega el correo y la contraseña al activar `auth`.
// Los roles se definen en T4.
export const coleccionUsuarios: CollectionConfig = {
  slug: 'usuarios',
  labels: { singular: 'Usuario', plural: 'Usuarios' },
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [],
}
