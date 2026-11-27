import { coleccionAvisosParaClientes } from '@/modulos/avisos/infraestructura/coleccion-avisos-para-clientes'
import { coleccionPublicaciones } from '@/modulos/blog/infraestructura/coleccion-publicaciones'
import { coleccionMensajesDeContacto } from '@/modulos/contacto/infraestructura/coleccion-mensajes-de-contacto'
import { globalPaginaDeInicio } from '@/modulos/portada/infraestructura/global-pagina-de-inicio'

import type { EnlaceRapido } from '../../componentes/panel/enlace-rapido'

// Lo que más se edita, en el orden del día a día. Las rutas salen de los slugs de cada
// colección o global, así un cambio de slug no deja un enlace roto.
export function armarEnlacesRapidos(rutaDelPanel: string): EnlaceRapido[] {
  const coleccion = (slug: string) => `${rutaDelPanel}/collections/${slug}`
  return [
    {
      clave: 'inicio',
      etiqueta: 'Editar la página de inicio',
      href: `${rutaDelPanel}/globals/${globalPaginaDeInicio.slug}`,
    },
    {
      clave: 'avisos',
      etiqueta: 'Avisos para clientes',
      href: coleccion(coleccionAvisosParaClientes.slug),
    },
    {
      clave: 'publicacion',
      etiqueta: 'Escribir una publicación',
      href: `${coleccion(coleccionPublicaciones.slug)}/create`,
    },
    {
      clave: 'mensajes',
      etiqueta: 'Mensajes de contacto',
      href: coleccion(coleccionMensajesDeContacto.slug),
    },
  ]
}
