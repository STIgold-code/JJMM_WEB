import type { CollectionConfig } from 'payload'

import { ACCESO_DE_CONTENIDO } from '@/compartido/infraestructura/acceso'
import { campoActivo, campoOrden } from '@/compartido/infraestructura/campos/campos-comunes'
import { validarUrlHttpsOpcional } from '@/compartido/infraestructura/campos/validaciones'

// Logotipos de clientes del carrusel «Nuestros clientes». Solo clientes reales (S9).
export const coleccionClientes: CollectionConfig = {
  slug: 'clientes',
  labels: { singular: 'Cliente', plural: 'Clientes' },
  admin: {
    useAsTitle: 'nombre',
    defaultColumns: ['nombre', 'orden', 'activo'],
    group: 'Inicio',
  },
  defaultSort: 'orden',
  access: ACCESO_DE_CONTENIDO,
  fields: [
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'logo', label: 'Logotipo', type: 'upload', relationTo: 'medios', required: true },
    {
      name: 'enlace',
      label: 'Sitio web',
      type: 'text',
      validate: validarUrlHttpsOpcional,
      admin: { description: 'Opcional. Dirección https:// del cliente.' },
    },
    campoOrden(),
    campoActivo('Visible'),
  ],
}
