// Ids del DOM que comparten la galería (servidor) y el panel lateral (cliente) para devolver el
// foco al cerrarlo. Viven aparte: un valor exportado desde un archivo `'use client'` llega al
// servidor como referencia, no como texto.
export const ID_DE_LA_GALERIA = 'galeria-de-imagenes'

export const idDeLaImagen = (id: number): string => `imagen-${id}`
