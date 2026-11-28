import { aImagen } from '@/compartido/infraestructura/imagen-de-medio'
import type { AreasDeServicio } from '@/payload-types'

import type { RepositorioDeLecturaDeAreas, RuedaDelSitio } from '../aplicacion/consultar-areas'
import type { AreaDelPanel } from '../dominio/areas-de-servicio'
import type { SesionDelPanel } from './sesion-del-panel'

export const aAreaDelPanel = (doc: AreasDeServicio): AreaDelPanel => ({
  id: doc.id,
  codigo: doc.codigo,
  nombre: doc.nombre,
  nombreCorto: doc.nombreCorto,
  descripcion: doc.descripcion,
  puntos: (doc.puntos ?? []).map((punto) => punto.texto),
  mensajeDeConsulta: doc.mensajeDeConsulta?.trim() || null,
  poligono: doc.poligonoEnLaRueda?.trim() || null,
  orden: doc.orden,
})

// La sección «Nuestros servicios» de la página de inicio; `depth: 1` trae la imagen de la rueda.
async function leerRueda({ payload, usuario }: SesionDelPanel): Promise<RuedaDelSitio | null> {
  const pagina = await payload.findGlobal({
    slug: 'pagina-de-inicio',
    overrideAccess: false,
    user: usuario,
    depth: 1,
  })
  const seccion = pagina.secciones?.find((bloque) => bloque.blockType === 'servicios')
  if (seccion?.blockType !== 'servicios') return null
  return {
    titulo: seccion.titulo,
    imagen: aImagen(seccion.imagenDeLaRueda),
    textoDelBoton: seccion.textoDelBoton,
  }
}

// Una global que nunca se guardó llega sin el grupo `contacto`.
async function leerMensajePorDefecto({ payload, usuario }: SesionDelPanel) {
  const configuracion = await payload.findGlobal({
    slug: 'configuracion-del-sitio',
    overrideAccess: false,
    user: usuario,
    depth: 0,
  })
  return configuracion.contacto?.mensajeWhatsApp?.trim() || null
}

// Adaptador de Payload de las lecturas de áreas, con la Local API, `overrideAccess: false` y el
// usuario de la sesión. Son nueve: sin paginar.
export function crearLecturaDeAreas(sesion: SesionDelPanel): RepositorioDeLecturaDeAreas {
  const { payload, usuario } = sesion
  return {
    listarAreas: async () => {
      const { docs } = await payload.find({
        collection: 'areas-de-servicio',
        sort: 'orden',
        overrideAccess: false,
        user: usuario,
        depth: 0,
        pagination: false,
      })
      return docs.map(aAreaDelPanel)
    },
    leerRueda: () => leerRueda(sesion),
    leerMensajePorDefecto: () => leerMensajePorDefecto(sesion),
  }
}
