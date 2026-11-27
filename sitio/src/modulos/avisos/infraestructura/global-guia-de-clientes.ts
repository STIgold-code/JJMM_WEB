import type { GlobalConfig } from 'payload'

import { accesoPublico, soloEquipo } from '@/compartido/infraestructura/acceso'
import { campoSeo } from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'

// Textos propios de la página /guia. Los avisos, vencimientos y cronogramas son colecciones.
export const globalGuiaDeClientes: GlobalConfig = {
  slug: 'guia-de-clientes',
  label: 'Página de la guía',
  admin: {
    group: GRUPOS_DEL_PANEL.guia,
    description:
      'Títulos e introducción de la página Guía de clientes (/guia). Los avisos, vencimientos y cronogramas se editan en sus propias listas de este grupo.',
  },
  access: { read: accesoPublico, update: soloEquipo },
  fields: [
    { name: 'titulo', label: 'Título', type: 'text', required: true },
    { name: 'introduccion', label: 'Introducción', type: 'textarea' },
    { name: 'tituloDeAvisos', label: 'Título de los avisos', type: 'text', required: true },
    {
      name: 'tituloDeVencimientos',
      label: 'Título de los vencimientos',
      type: 'text',
      required: true,
    },
    {
      name: 'tituloDelCronograma',
      label: 'Título del cronograma de SUNAT',
      type: 'text',
      required: true,
    },
    campoSeo(),
  ],
}
