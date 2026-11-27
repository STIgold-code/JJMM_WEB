import type { SanitizedPermissions } from 'payload'

import { coleccionMedios } from '@/compartido/infraestructura/coleccion-medios'
import { coleccionAvisosParaClientes } from '@/modulos/avisos/infraestructura/coleccion-avisos-para-clientes'
import { coleccionPublicaciones } from '@/modulos/blog/infraestructura/coleccion-publicaciones'
import { globalPaginaDeInicio } from '@/modulos/portada/infraestructura/global-pagina-de-inicio'

import type { EnlaceRapido } from '../../componentes/panel/enlace-rapido'

interface Acceso extends EnlaceRapido {
  permitido: (permisos: SanitizedPermissions) => boolean
}

const puedeCrear = (slug: string) => (permisos: SanitizedPermissions) =>
  permisos.collections?.[slug]?.create === true

// Lo que más se hace, en el orden del día a día. Las rutas salen de los slugs de cada colección
// o global, así un cambio de slug no deja un enlace roto. Solo se ofrece lo que la cuenta puede
// hacer.
function accesos(rutaDelPanel: string): Acceso[] {
  const crear = (slug: string) => `${rutaDelPanel}/collections/${slug}/create`
  return [
    {
      clave: 'publicacion',
      etiqueta: 'Escribir una publicación',
      href: crear(coleccionPublicaciones.slug),
      icono: 'pluma',
      permitido: puedeCrear(coleccionPublicaciones.slug),
    },
    {
      clave: 'aviso',
      etiqueta: 'Publicar un aviso para clientes',
      href: crear(coleccionAvisosParaClientes.slug),
      icono: 'aviso',
      permitido: puedeCrear(coleccionAvisosParaClientes.slug),
    },
    {
      clave: 'inicio',
      etiqueta: 'Editar la página de inicio',
      href: `${rutaDelPanel}/globals/${globalPaginaDeInicio.slug}`,
      icono: 'inicio',
      permitido: (permisos) => permisos.globals?.[globalPaginaDeInicio.slug]?.update === true,
    },
    {
      clave: 'imagen',
      etiqueta: 'Subir una imagen',
      href: crear(coleccionMedios.slug),
      icono: 'subir-imagen',
      permitido: puedeCrear(coleccionMedios.slug),
    },
  ]
}

export function armarEnlacesRapidos(
  rutaDelPanel: string,
  permisos: SanitizedPermissions,
): EnlaceRapido[] {
  return accesos(rutaDelPanel)
    .filter(({ permitido }) => permitido(permisos))
    .map(({ clave, etiqueta, href, icono }) => ({ clave, etiqueta, href, icono }))
}
