import { etiquetaDeColeccion, etiquetaDeDocumento } from '@/compartido/dominio/etiquetas-de-cache'

// Profundidad 1: se pueblan categoría, etiquetas e imagen (y las imágenes del contenido).
const RELACIONES = ['categorias', 'etiquetas', 'medios'].map(etiquetaDeColeccion)
const PUBLICACIONES = etiquetaDeColeccion('publicaciones')

export function etiquetasDelListado(): string[] {
  return [PUBLICACIONES, ...RELACIONES]
}

// El contenido enriquecido puede enlazar a otras publicaciones y el enlace se arma con su slug.
// Por eso el detalle también se invalida cuando cambia cualquier publicación: si se renombra o
// se despublica la enlazada, el enlace no queda apuntando a una página que ya no existe.
export function etiquetasDelDetalle(slug: string): string[] {
  return [etiquetaDeDocumento('publicaciones', slug), PUBLICACIONES, ...RELACIONES]
}
