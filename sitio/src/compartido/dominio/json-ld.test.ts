import { describe, expect, it } from 'vitest'

import { migasDeNavegacion, serializarJsonLd } from './json-ld'

describe('serializarJsonLd', () => {
  it('escapa < para que el contenido no pueda cerrar la etiqueta <script>', () => {
    const texto = serializarJsonLd({ name: '</script><script>alert(1)</script>' })

    expect(texto).not.toContain('<')
    expect(texto).toContain('\\u003c/script>')
    expect(JSON.parse(texto)).toEqual({ name: '</script><script>alert(1)</script>' })
  })

  it('escapa los separadores de línea U+2028 y U+2029', () => {
    const texto = serializarJsonLd({ name: 'a\u2028b\u2029c' })

    expect(texto).toBe('{"name":"a\\u2028b\\u2029c"}')
    expect(JSON.parse(texto)).toEqual({ name: 'a\u2028b\u2029c' })
  })
})

describe('migasDeNavegacion', () => {
  it('arma un BreadcrumbList con posiciones desde 1 y URL absolutas', () => {
    const origen = new URL('https://sigemype.com')

    expect(
      migasDeNavegacion(origen, [
        { nombre: 'Estudio Contable JJMM', ruta: '/' },
        { nombre: 'Blog', ruta: '/blog' },
      ]),
    ).toEqual({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Estudio Contable JJMM',
          item: 'https://sigemype.com/',
        },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://sigemype.com/blog' },
      ],
    })
  })
})
