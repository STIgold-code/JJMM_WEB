import type { GlobalConfig } from 'payload'

import { accesoPublico, soloEquipo } from '@/compartido/infraestructura/acceso'
import { campoSeo } from '@/compartido/infraestructura/campos/campos-comunes'

// Textos propios del listado /blog. Las publicaciones son una colección.
export const globalPaginaDelBlog: GlobalConfig = {
  slug: 'pagina-del-blog',
  label: 'Página del blog',
  admin: { group: 'Blog' },
  access: { read: accesoPublico, update: soloEquipo },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    { name: 'introduccion', label: 'Introducción', type: 'textarea' },
    {
      name: 'textoSinPublicaciones',
      label: 'Texto cuando no hay publicaciones',
      type: 'text',
      required: true,
    },
    campoSeo(),
  ],
}
