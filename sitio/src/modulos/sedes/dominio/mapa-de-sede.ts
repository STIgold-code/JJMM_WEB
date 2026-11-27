// Mapas de una sede en Google Maps. El sitio solo incrusta mapas de este origen: una dirección
// cualquiera guardada en el panel nunca llega a un iframe.
const ORIGEN_DE_GOOGLE = 'https://www.google.com'
const RUTA_DE_INSERCION = '/maps/embed'

function leerUrl(valor: string): URL | null {
  try {
    return new URL(valor)
  } catch {
    return null
  }
}

// Dirección que da Google Maps en «Compartir › Insertar un mapa».
export function esMapaIncrustadoDeGoogle(valor: string): boolean {
  const url = leerUrl(valor.trim())
  if (!url || url.username || url.password) return false
  return url.origin === ORIGEN_DE_GOOGLE && url.pathname === RUTA_DE_INSERCION && url.search !== ''
}

// El mapa guardado en el panel ubica el local exacto; sin él, se busca la dirección (v5).
export function urlDelMapaIncrustado(guardado: string | null, direccion: string): string {
  if (guardado && esMapaIncrustadoDeGoogle(guardado)) return guardado.trim()
  return `${ORIGEN_DE_GOOGLE}/maps?q=${encodeURIComponent(direccion)}&output=embed`
}

// «Cómo llegar»: abre la dirección en Google Maps, que ofrece la ruta.
export function urlParaComoLlegar(direccion: string): string {
  return `${ORIGEN_DE_GOOGLE}/maps/search/?api=1&query=${encodeURIComponent(direccion)}`
}
