import type { ContactoDelSitio } from '@/compartido/dominio/configuracion-del-sitio'
import { aImagen } from '@/compartido/infraestructura/imagen-de-medio'
import type { BloqueCarruselDePortadas } from '@/payload-types'

import { type AccionDePortada, resolverAccion } from '../dominio/accion-de-portada'
import {
  type CarruselPublico,
  indiceDelTituloPrincipal,
  type PortadaPublica,
} from '../dominio/portada'
import { segmentarTextoResaltado } from '../dominio/texto-resaltado'

type PortadaGuardada = NonNullable<BloqueCarruselDePortadas['portadas']>[number]
type AccionGuardadaPayload = NonNullable<PortadaGuardada['acciones']>[number]

const textoOpcional = (valor: string | null | undefined): string | null => valor?.trim() || null

function mapearAcciones(
  acciones: readonly AccionGuardadaPayload[],
  contacto: ContactoDelSitio | null,
): AccionDePortada[] {
  // Sin configuración no hay celulares: los botones de WhatsApp y llamada no se publican.
  if (!contacto) return []
  return acciones
    .map((accion) =>
      resolverAccion(
        {
          etiqueta: accion.etiqueta,
          tipo: accion.tipo,
          mensaje: accion.mensaje ?? null,
          destino: accion.destino ?? null,
          estilo: accion.estilo,
        },
        contacto,
      ),
    )
    .filter((accion) => accion !== null)
}

function mapearPortada(
  portada: PortadaGuardada,
  contacto: ContactoDelSitio | null,
): Omit<PortadaPublica, 'esTituloPrincipal'> | null {
  const imagen = aImagen(portada.imagen)
  if (!imagen) return null
  const titulo = textoOpcional(portada.titulo)
  return {
    imagen,
    imagenEsDecorativa: portada.imagenEsDecorativa ?? true,
    imagenParaCelular: aImagen(portada.imagenParaCelular),
    encuadreEnCelular: portada.encuadreEnCelular ?? null,
    disposicion: portada.disposicion,
    transicion: portada.transicion,
    titulo: titulo ? segmentarTextoResaltado(titulo) : null,
    subtitulo: textoOpcional(portada.subtitulo),
    sello: aImagen(portada.sello),
    lista: (portada.lista ?? []).map((punto) => punto.texto),
    acciones: mapearAcciones(portada.acciones ?? [], contacto),
  }
}

// Una portada sin imagen publicable no se dibuja; sin portadas, el carrusel tampoco.
export function mapearCarrusel(
  bloque: BloqueCarruselDePortadas,
  contacto: ContactoDelSitio | null,
): CarruselPublico | null {
  const portadas = (bloque.portadas ?? [])
    .map((portada) => mapearPortada(portada, contacto))
    .filter((portada) => portada !== null)
  if (portadas.length === 0) return null
  const principal = indiceDelTituloPrincipal(portadas)
  return {
    segundosPorPortada: bloque.segundosPorPortada,
    portadas: portadas.map((portada, indice) => ({
      ...portada,
      esTituloPrincipal: indice === principal,
    })),
  }
}
