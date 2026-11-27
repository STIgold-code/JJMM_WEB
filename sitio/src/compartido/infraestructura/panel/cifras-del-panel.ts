import { coleccionAvisosParaClientes } from '@/modulos/avisos/infraestructura/coleccion-avisos-para-clientes'
import { coleccionPublicaciones } from '@/modulos/blog/infraestructura/coleccion-publicaciones'
import { coleccionMensajesDeContacto } from '@/modulos/contacto/infraestructura/coleccion-mensajes-de-contacto'
import { coleccionSedes } from '@/modulos/sedes/infraestructura/coleccion-sedes'

import type { Cifra } from '../../componentes/panel/modelo-del-inicio'
import { cantidadConNombre } from '../../componentes/panel/textos-del-inicio'

// Conteos reales del inicio del panel. `null` cuando la cuenta no puede leer esa colección:
// la cifra no se muestra, nunca se inventa un cero.
export interface ConteosDelInicio {
  mensajesNuevos: number | null
  publicadas: number | null
  borradores: number | null
  avisosVisibles: number | null
  sedesActivas: number | null
}

type CifraPosible = Omit<Cifra, 'valor'> & { valor: number | null }
type Lista = (slug: string) => string

function cifraDeMensajes({ mensajesNuevos }: ConteosDelInicio, lista: Lista): CifraPosible {
  const nuevos = mensajesNuevos ?? 0
  return {
    clave: 'mensajes',
    valor: mensajesNuevos,
    etiqueta: cantidadConNombre(nuevos, 'mensaje nuevo', 'mensajes nuevos'),
    detalle: nuevos > 0 ? 'Por responder' : 'Todo al día',
    href: `${lista(coleccionMensajesDeContacto.slug)}?where[estado][equals]=nuevo`,
    icono: 'mensaje',
    destacada: nuevos > 0,
  }
}

function detalleDeBorradores(borradores: number | null): string {
  if (!borradores) return 'Ningún borrador pendiente'
  return `${borradores} ${cantidadConNombre(borradores, 'borrador sin publicar', 'borradores sin publicar')}`
}

function cifraDePublicaciones(conteos: ConteosDelInicio, lista: Lista): CifraPosible {
  const { publicadas, borradores } = conteos
  return {
    clave: 'publicaciones',
    valor: publicadas,
    etiqueta: cantidadConNombre(
      publicadas ?? 0,
      'publicación en el blog',
      'publicaciones en el blog',
    ),
    detalle: detalleDeBorradores(borradores),
    href: lista(coleccionPublicaciones.slug),
    icono: 'pluma',
    destacada: false,
  }
}

function cifraDeAvisos({ avisosVisibles }: ConteosDelInicio, lista: Lista): CifraPosible {
  return {
    clave: 'avisos',
    valor: avisosVisibles,
    etiqueta: cantidadConNombre(avisosVisibles ?? 0, 'aviso visible', 'avisos visibles'),
    detalle: 'En la guía de clientes',
    href: lista(coleccionAvisosParaClientes.slug),
    icono: 'aviso',
    destacada: false,
  }
}

function cifraDeSedes({ sedesActivas }: ConteosDelInicio, lista: Lista): CifraPosible {
  return {
    clave: 'sedes',
    valor: sedesActivas,
    etiqueta: cantidadConNombre(sedesActivas ?? 0, 'sede activa', 'sedes activas'),
    detalle: 'En la cabecera, el pie y «Contáctanos»',
    href: lista(coleccionSedes.slug),
    icono: 'ubicacion',
    destacada: false,
  }
}

const CIFRAS = [cifraDeMensajes, cifraDePublicaciones, cifraDeAvisos, cifraDeSedes]

export function armarCifras(conteos: ConteosDelInicio, rutaDelPanel: string): Cifra[] {
  const lista: Lista = (slug) => `${rutaDelPanel}/collections/${slug}`
  return CIFRAS.map((armar) => armar(conteos, lista)).filter(
    (cifra): cifra is Cifra => cifra.valor !== null,
  )
}
