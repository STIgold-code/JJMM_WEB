import type { GlobalConfig } from 'payload'

import { accesoPublico, soloAdministradores } from '@/compartido/infraestructura/acceso'
import { camposDeEnlace } from '@/compartido/infraestructura/campos/campos-de-enlace'

// Menú principal del sitio (cabecera y menú del celular), en el orden en que se muestra.
// SIGEFact es un ítem externo con logo y pestaña nueva (S7).
export const globalNavegacion: GlobalConfig = {
  slug: 'navegacion',
  label: 'Menú principal',
  admin: { group: 'Sitio' },
  access: { read: accesoPublico, update: soloAdministradores },
  fields: [
    {
      name: 'items',
      label: 'Ítems del menú',
      labels: { singular: 'Ítem', plural: 'Ítems' },
      type: 'array',
      fields: [
        ...camposDeEnlace(),
        {
          name: 'abrirEnNuevaPestana',
          label: 'Abrir en una pestaña nueva',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'imagen',
          label: 'Logo (opcional)',
          type: 'upload',
          relationTo: 'medios',
          admin: {
            description: 'Se muestra en lugar de la etiqueta en la cabecera, como el de SIGEFact.',
          },
        },
      ],
    },
  ],
}
