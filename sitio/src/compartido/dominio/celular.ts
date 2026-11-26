// Regla de contenido S9: el sitio solo publica celulares, nunca teléfonos fijos.
// En Perú un celular tiene 9 dígitos y empieza con 9; se admiten espacios como separadores.
const PATRON_CELULAR_PERUANO = /^9\d{8}$/

export function normalizarCelular(valor: string): string {
  return valor.replace(/\s+/g, '')
}

export function esCelularPeruano(valor: string): boolean {
  return PATRON_CELULAR_PERUANO.test(normalizarCelular(valor))
}
