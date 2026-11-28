// Rutas del panel propio y del /admin de Payload, que sigue siendo el respaldo mientras las
// secciones del panel no existan.
export const RUTA_DEL_INICIO = '/panel'
export const RUTA_DE_INGRESO = '/panel/ingreso'
export const RUTA_DEL_ADMIN = '/admin'
// Una sola pantalla con avisos, vencimientos y el cronograma de SUNAT (L4 f).
export const RUTA_DE_LA_GUIA = `${RUTA_DEL_INICIO}/guia`
// La página de inicio del sitio; sus pantallas internas (carrusel, valores) cuelgan de ella.
export const RUTA_DE_LA_PAGINA_DE_INICIO = `${RUTA_DEL_INICIO}/pagina-de-inicio`

export function listaEnAdmin(slug: string, filtro = ''): string {
  return `${RUTA_DEL_ADMIN}/collections/${slug}${filtro}`
}

export function documentoEnAdmin(slug: string, id: number | string): string {
  return `${listaEnAdmin(slug)}/${id}`
}
