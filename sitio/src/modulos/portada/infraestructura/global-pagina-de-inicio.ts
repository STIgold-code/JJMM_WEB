import type { GlobalConfig } from 'payload'

import { accesoPublico, soloEquipo } from '@/compartido/infraestructura/acceso'
import { campoSeo } from '@/compartido/infraestructura/campos/campos-comunes'
import { GRUPOS_DEL_PANEL } from '@/compartido/infraestructura/panel/grupos-del-panel'
import { bloqueClientes } from '@/modulos/clientes/infraestructura/bloque-clientes'
import { bloqueContacto } from '@/modulos/contacto/infraestructura/bloque-contacto'
import { bloquePorQueElegirnos } from '@/modulos/nosotros/infraestructura/bloque-por-que-elegirnos'
import { bloqueQuienesSomos } from '@/modulos/nosotros/infraestructura/bloque-quienes-somos'
import { bloquePlanes } from '@/modulos/planes/infraestructura/bloque-planes'
import { bloqueServicios } from '@/modulos/servicios/infraestructura/bloque-servicios'

import { bloqueCarruselDePortadas } from './bloque-carrusel-de-portadas'

// Página de inicio (S5): secciones reordenables como bloques. Cada bloque se dibuja con el
// registro `tipo → componente` (ADR 0001). Se llama «página de inicio» y no «portada» para no
// confundirla con las portadas del carrusel.
export const globalPaginaDeInicio: GlobalConfig = {
  slug: 'pagina-de-inicio',
  label: 'Página de inicio',
  // Prefijo corto de las tablas: los bloques anidados superan el límite de 63 caracteres
  // de PostgreSQL con el nombre completo.
  dbName: 'inicio',
  admin: {
    group: GRUPOS_DEL_PANEL.inicio,
    description:
      'Contenido de la página principal del sitio (/), sección por sección. Los planes, áreas, valores y clientes que muestran algunas secciones se editan en sus propias listas del grupo Inicio.',
  },
  access: { read: accesoPublico, update: soloEquipo },
  fields: [
    {
      name: 'secciones',
      label: 'Secciones',
      labels: { singular: 'Sección', plural: 'Secciones' },
      type: 'blocks',
      admin: {
        description:
          'Se muestran en este orden. Arrastra una sección para moverla; si quitas una, deja de verse en el inicio.',
      },
      blocks: [
        bloqueCarruselDePortadas,
        bloqueQuienesSomos,
        bloqueServicios,
        bloquePlanes,
        bloquePorQueElegirnos,
        bloqueClientes,
        bloqueContacto,
      ],
    },
    campoSeo(),
  ],
}
