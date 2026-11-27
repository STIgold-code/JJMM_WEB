import type { GlobalConfig } from 'payload'

import { accesoPublico, soloEquipo } from '@/compartido/infraestructura/acceso'
import { campoSeo } from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

// Textos propios del listado /blog. Las publicaciones son una colección.
export const globalPaginaDelBlog: GlobalConfig = {
  slug: 'pagina-del-blog',
  label: 'Página del blog',
  admin: {
    group: GRUPOS_DEL_PANEL.blog,
    description:
      'Título, introducción y SEO del listado del blog (/blog). Los artículos se escriben en «Publicaciones».',
  },
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
