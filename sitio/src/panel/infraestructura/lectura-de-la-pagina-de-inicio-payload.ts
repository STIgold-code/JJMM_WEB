import type { BloqueCarruselDePortadas } from '@/payload-types'

import type { RepositorioDeLecturaDelInicio } from '../aplicacion/consultar-pagina-de-inicio'
import {
  aCarruselGuardado,
  aSeccionLeida,
  type SeccionDePayload,
} from './bloque-de-carrusel-payload'
import type { SesionDelPanel } from './sesion-del-panel'

type CarruselConId = BloqueCarruselDePortadas & { id: string }

const esCarruselConId = (seccion: SeccionDePayload): seccion is CarruselConId =>
  seccion.blockType === 'carrusel-de-portadas' && typeof seccion.id === 'string'

// Adaptador de Payload de las lecturas de la página de inicio, con la Local API,
// `overrideAccess: false` y el usuario de la sesión. Una global que nunca se guardó llega sin
// secciones ni `updatedAt`.
export function crearLecturaDeLaPaginaDeInicio(
  sesion: SesionDelPanel,
): RepositorioDeLecturaDelInicio {
  const { payload, usuario } = sesion
  const permisos = { overrideAccess: false, user: usuario } as const
  return {
    leerSecciones: async () => {
      const pagina = await payload.findGlobal({ slug: 'pagina-de-inicio', depth: 0, ...permisos })
      return {
        actualizadoEn: pagina.updatedAt ?? null,
        secciones: (pagina.secciones ?? []).map(aSeccionLeida),
      }
    },
    // `depth: 1` trae las imágenes para sus miniaturas.
    leerCarrusel: async (seccion) => {
      const pagina = await payload.findGlobal({ slug: 'pagina-de-inicio', depth: 1, ...permisos })
      const bloque = (pagina.secciones ?? [])
        .filter(esCarruselConId)
        .find((carrusel) => seccion === null || carrusel.id === seccion)
      if (!bloque || !pagina.updatedAt) return null
      return aCarruselGuardado(bloque, pagina.updatedAt)
    },
  }
}
