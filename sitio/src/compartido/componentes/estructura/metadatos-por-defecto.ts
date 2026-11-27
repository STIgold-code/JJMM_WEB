import type { Metadata } from 'next'

import type { DatosDelSitio } from '@/compartido/aplicacion/obtener-datos-del-sitio'

// Metadatos que heredan todas las páginas públicas. Cada página define su propio título
// y la plantilla le agrega el nombre comercial. Sin configuración guardada, nada.
export function metadatosPorDefecto(datos: DatosDelSitio | null): Metadata {
  if (!datos) return {}
  const { seo, marca } = datos
  return {
    title: { default: seo.titulo, template: `%s | ${marca.nombreComercial}` },
    description: seo.descripcion,
  }
}
