// URL pública del sitio (`NEXT_PUBLIC_SITE_URL`): base de canonical, Open Graph, sitemap y
// datos estructurados. Sin dependencias: también la importa `next.config.ts`.

export const VARIABLE_DE_URL_DEL_SITIO = 'NEXT_PUBLIC_SITE_URL'
export const URL_DE_DESARROLLO = 'http://localhost:3000'

const PROTOCOLOS_VALIDOS = new Set(['http:', 'https:'])

export class UrlDelSitioInvalidaError extends Error {
  constructor(detalle: string) {
    super(
      `${VARIABLE_DE_URL_DEL_SITIO} ${detalle}. Defínela con el origen público del sitio, ` +
        'por ejemplo https://sigemype.com (sin ruta, parámetros ni barra final).',
    )
    this.name = 'UrlDelSitioInvalidaError'
  }
}

function interpretar(valor: string): URL {
  try {
    return new URL(valor)
  } catch {
    throw new UrlDelSitioInvalidaError(`no es una URL válida («${valor}»)`)
  }
}

// Exige un origen http(s): sin ruta, parámetros ni fragmento.
export function leerUrlDelSitio(valor: string | undefined): URL {
  const limpio = valor?.trim()
  if (!limpio) throw new UrlDelSitioInvalidaError('no está definida')
  const url = interpretar(limpio)
  if (!PROTOCOLOS_VALIDOS.has(url.protocol)) {
    throw new UrlDelSitioInvalidaError(`debe empezar con http:// o https:// («${limpio}»)`)
  }
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new UrlDelSitioInvalidaError(`debe ser solo el origen («${limpio}»)`)
  }
  return url
}

// En producción la variable es obligatoria; en desarrollo y pruebas se usa el servidor local.
export function resolverUrlDelSitio(valor: string | undefined, esProduccion: boolean): URL {
  if (!esProduccion && !valor?.trim()) return new URL(URL_DE_DESARROLLO)
  return leerUrlDelSitio(valor)
}

// Una ruta del sitio (o una dirección ya absoluta) como URL absoluta.
export const urlAbsoluta = (origen: URL, ruta: string): string => new URL(ruta, origen).href
