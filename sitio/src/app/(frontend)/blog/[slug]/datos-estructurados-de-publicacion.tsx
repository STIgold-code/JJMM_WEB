import { DatosEstructurados } from '@/compartido/componentes/datos-estructurados'
import { obtenerDatosDelSitio } from '@/compartido/componentes/estructura/datos-del-sitio'
import { migasDeNavegacion } from '@/compartido/dominio/json-ld'
import { urlDelSitio } from '@/compartido/infraestructura/url-del-sitio-configurada'
import { obtenerPaginaDelBlog } from '@/modulos/blog/componentes/obtener-blog'
import {
  datosEstructuradosDePublicacion,
  migasDePublicacion,
} from '@/modulos/blog/dominio/datos-estructurados-de-publicacion'
import type { DetalleDePublicacion } from '@/modulos/blog/dominio/publicacion'

interface PropsDeDatosDePublicacion {
  publicacion: DetalleDePublicacion<unknown>
}

// Contenedor: BlogPosting y BreadcrumbList de una publicación. El nombre del estudio y el
// título del blog salen del panel; sin ellos no se publica lo que los necesita.
export async function DatosEstructuradosDePublicacion({ publicacion }: PropsDeDatosDePublicacion) {
  const [sitio, blog] = await Promise.all([obtenerDatosDelSitio(), obtenerPaginaDelBlog()])
  if (!sitio) return null
  const origen = urlDelSitio()
  const { nombreComercial, logo } = sitio.marca
  const estudio = { nombre: nombreComercial, logo: logo?.url ?? null }
  const textos = blog ? { nombreDelSitio: nombreComercial, tituloDelBlog: blog.titulo } : null
  return (
    <>
      <DatosEstructurados datos={datosEstructuradosDePublicacion(origen, publicacion, estudio)} />
      {textos ? (
        <DatosEstructurados
          datos={migasDeNavegacion(origen, migasDePublicacion(publicacion, textos))}
        />
      ) : null}
    </>
  )
}
