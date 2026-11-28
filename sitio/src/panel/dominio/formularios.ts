// Piezas comunes para validar en el servidor los formularios del panel, que llegan del navegador
// sin tipar (`unknown`).
export const ERROR_DE_FORMULARIO =
  'No se pudo leer el formulario. Recarga la página e inténtalo de nuevo.'

export const esObjeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === 'object' && valor !== null && !Array.isArray(valor)
