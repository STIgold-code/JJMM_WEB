import type { BlogSemilla, GuiaSemilla } from './tipos'

// Encabezados de /guia y /blog. El sitio actual no tiene estos títulos escritos (la guía son
// tres imágenes y el blog no tiene encabezado): se usan los nombres del menú y de las
// imágenes, sin agregar información nueva.
export const GUIA_DE_CLIENTES: GuiaSemilla = {
  titulo: 'Guía de clientes',
  tituloDeAvisos: 'Avisos para clientes',
  tituloDeVencimientos: 'Vencimientos tributarios',
  tituloDelCronograma: 'Cronograma de SUNAT',
}

export const PAGINA_DEL_BLOG: BlogSemilla = {
  titulo: 'Blog',
  textoSinPublicaciones: 'Todavía no hay publicaciones.',
}
