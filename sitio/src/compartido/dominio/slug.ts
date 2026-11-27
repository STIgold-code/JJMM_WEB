// Identificador legible de una URL (por ejemplo /blog/que-es-el-igv): minúsculas, dígitos y
// guiones simples, sin tildes ni guiones en los extremos.
const PATRON_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MARCAS_DIACRITICAS = /[̀-ͯ]/g
const SEPARADORES = /[^a-z0-9]+/g
const GUIONES_EN_EXTREMOS = /^-+|-+$/g

export function esSlugValido(valor: string): boolean {
  return PATRON_SLUG.test(valor)
}

export function generarSlug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(MARCAS_DIACRITICAS, '')
    .toLowerCase()
    .replace(SEPARADORES, '-')
    .replace(GUIONES_EN_EXTREMOS, '')
}
