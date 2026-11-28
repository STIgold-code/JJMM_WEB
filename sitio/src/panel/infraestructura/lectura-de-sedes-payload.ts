import type { Sede } from '@/payload-types'

import type { RepositorioDeLecturaDeSedes, TextosDeContacto } from '../aplicacion/consultar-sedes'
import type { SedeDelPanel } from '../dominio/sedes'
import type { SesionDelPanel } from './sesion-del-panel'

// «Visible» se lee igual que el sitio público, que solo muestra las sedes con `activo: true`.
export const aSedeDelPanel = (doc: Sede): SedeDelPanel => ({
  id: doc.id,
  nombre: doc.nombre,
  direccion: doc.direccion,
  distrito: doc.distrito,
  ciudad: doc.ciudad,
  celulares: (doc.celulares ?? []).map(({ numero, tieneWhatsApp }) => ({
    numero,
    tieneWhatsApp: tieneWhatsApp === true,
  })),
  correo: doc.correo?.trim() || null,
  mapa: doc.enlaceDeMapa?.trim() || null,
  visible: doc.activo === true,
  orden: doc.orden,
})

// Adaptador de Payload de las lecturas de sedes. Usa la Local API con `overrideAccess: false` y
// el usuario de la sesión, sin paginar (el estudio tiene dos sedes).
export function crearLecturaDeSedes(sesion: SesionDelPanel): RepositorioDeLecturaDeSedes {
  const { payload, usuario } = sesion
  const lectura = { overrideAccess: false, user: usuario, depth: 0, pagination: false } as const
  return {
    listarSedes: async () => {
      const { docs } = await payload.find({ collection: 'sedes', sort: 'orden', ...lectura })
      return docs.map(aSedeDelPanel)
    },
    leerTextosDeContacto: () => leerTextosDeContacto(sesion),
  }
}

// Textos de los botones de «Contáctanos», o `null` si la página de inicio no tiene la sección.
// Igual que el sitio: un texto vacío quita el botón.
async function leerTextosDeContacto({
  payload,
  usuario,
}: SesionDelPanel): Promise<TextosDeContacto | null> {
  const pagina = await payload.findGlobal({
    slug: 'pagina-de-inicio',
    overrideAccess: false,
    user: usuario,
    depth: 0,
  })
  const seccion = pagina.secciones?.find((bloque) => bloque.blockType === 'contacto')
  if (seccion?.blockType !== 'contacto') return null
  return {
    titulo: seccion.titulo,
    comoLlegar: seccion.canales?.comoLlegar || null,
    verMapa: seccion.canales?.botonDelMapa || null,
  }
}
