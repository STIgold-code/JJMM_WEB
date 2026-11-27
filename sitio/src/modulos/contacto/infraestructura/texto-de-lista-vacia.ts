// Estado vacío de la lista de mensajes de contacto: los mensajes llegan del formulario del
// sitio, el equipo nunca los crea a mano.
export interface TextoDeListaVacia {
  titulo: string
  detalle: string
}

export function textoDeListaVacia(hayBusqueda: boolean): TextoDeListaVacia {
  return hayBusqueda
    ? {
        titulo: 'Ningún mensaje coincide con tu búsqueda.',
        detalle: 'Prueba con otras palabras o quita los filtros.',
      }
    : {
        titulo: 'Todavía no llegó ningún mensaje.',
        detalle:
          'Cuando alguien escriba desde el formulario «Contáctanos» del sitio, su mensaje aparecerá aquí.',
      }
}

interface ConsultaDeLista {
  search?: unknown
  where?: unknown
}

export function hayBusquedaOFiltros(consulta: ConsultaDeLista | undefined): boolean {
  if (!consulta) return false
  const busqueda = typeof consulta.search === 'string' && consulta.search.trim() !== ''
  const filtros =
    typeof consulta.where === 'object' &&
    consulta.where !== null &&
    Object.keys(consulta.where).length > 0
  return busqueda || filtros
}
