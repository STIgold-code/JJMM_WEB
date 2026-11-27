// Destino de un enlace editable desde el panel (menú y botones de acción, S7).
export const TIPOS_DE_DESTINO = ['seccion', 'interna', 'externa'] as const
export type TipoDeDestino = (typeof TIPOS_DE_DESTINO)[number]

const PATRON_SECCION = /^#[a-z0-9]+(?:-[a-z0-9]+)*$/
// Empieza con una sola barra (dos barras serían otro dominio) y no lleva espacios.
const PATRON_RUTA_INTERNA = /^\/(?!\/)\S*$/

const MENSAJES: Record<TipoDeDestino, string> = {
  seccion: 'Una sección se indica con # y su ancla en minúsculas, por ejemplo #planes.',
  interna: 'Una ruta interna empieza con una sola /, por ejemplo /guia.',
  externa:
    'Un enlace externo debe ser una dirección https://, por ejemplo https://sigefact.pse.pe/.',
}

export function esUrlHttps(valor: string): boolean {
  if (!URL.canParse(valor)) return false
  const url = new URL(valor)
  return url.protocol === 'https:' && url.hostname.length > 0
}

const VALIDADORES: Record<TipoDeDestino, (destino: string) => boolean> = {
  seccion: (destino) => PATRON_SECCION.test(destino),
  interna: (destino) => PATRON_RUTA_INTERNA.test(destino),
  externa: esUrlHttps,
}

// Devuelve null si el destino es válido para su tipo; si no, el mensaje para el panel.
export function validarDestino(tipo: TipoDeDestino, destino: string): string | null {
  return VALIDADORES[tipo](destino) ? null : MENSAJES[tipo]
}
