import { describe, expect, it } from 'vitest'

import { esSlugValido, generarSlug } from './slug'

describe('generarSlug', () => {
  it('quita tildes, pasa a minúsculas y separa con guiones', () => {
    expect(generarSlug('Régimen MYPE Tributario: guía 2026')).toBe(
      'regimen-mype-tributario-guia-2026',
    )
  })

  it('convierte la ñ en n', () => {
    expect(generarSlug('Año del ñandú')).toBe('ano-del-nandu')
  })

  it('no deja guiones repetidos ni en los extremos', () => {
    expect(generarSlug('  --¿Qué es el IGV?--  ')).toBe('que-es-el-igv')
  })
})

describe('esSlugValido', () => {
  it('acepta minúsculas, dígitos y guiones simples', () => {
    expect(esSlugValido('impuesto-a-la-renta-2026')).toBe(true)
  })

  it.each(['', 'Impuesto', 'a--b', '-a', 'a-', 'con espacio', 'guía'])('rechaza «%s»', (slug) => {
    expect(esSlugValido(slug)).toBe(false)
  })
})
