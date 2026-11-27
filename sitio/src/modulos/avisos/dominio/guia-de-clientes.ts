// Textos de la página /guia. Una global que nunca se guardó llega con campos vacíos.
export interface GuiaGuardada {
  titulo?: string | null
  introduccion?: string | null
  tituloDeAvisos?: string | null
  tituloDeVencimientos?: string | null
  tituloDelCronograma?: string | null
  seoTitulo?: string | null
  seoDescripcion?: string | null
}

export interface GuiaDeClientes {
  titulo: string
  introduccion: string | null
  tituloDeAvisos: string
  tituloDeVencimientos: string
  tituloDelCronograma: string
  seo: { titulo: string; descripcion: string | null }
}

const conTexto = (valor: string | null | undefined): string | null => {
  const limpio = valor?.trim()
  return limpio ? limpio : null
}

// Devuelve null si falta un título obligatorio: la página no se dibuja a medias.
export function prepararGuia(guardada: GuiaGuardada): GuiaDeClientes | null {
  const titulo = conTexto(guardada.titulo)
  const tituloDeAvisos = conTexto(guardada.tituloDeAvisos)
  const tituloDeVencimientos = conTexto(guardada.tituloDeVencimientos)
  const tituloDelCronograma = conTexto(guardada.tituloDelCronograma)
  if (!titulo || !tituloDeAvisos || !tituloDeVencimientos || !tituloDelCronograma) return null
  const introduccion = conTexto(guardada.introduccion)
  return {
    titulo,
    introduccion,
    tituloDeAvisos,
    tituloDeVencimientos,
    tituloDelCronograma,
    seo: {
      titulo: conTexto(guardada.seoTitulo) ?? titulo,
      descripcion: conTexto(guardada.seoDescripcion) ?? introduccion,
    },
  }
}
