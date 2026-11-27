import { describe, expect, it } from 'vitest'

import { esUrlHttps, validarDestino } from './destino-de-enlace'

describe('validarDestino', () => {
  it('acepta una sección de la página con su ancla', () => {
    expect(validarDestino('seccion', '#planes')).toBeNull()
    expect(validarDestino('seccion', '#quienes-somos')).toBeNull()
  })

  it.each(['planes', '#', '#Planes', '#con espacio', '/guia'])(
    'rechaza «%s» como sección',
    (destino) => {
      expect(validarDestino('seccion', destino)).toMatch(/#planes/)
    },
  )

  it('acepta una ruta interna del sitio', () => {
    expect(validarDestino('interna', '/guia')).toBeNull()
    expect(validarDestino('interna', '/blog/categoria/tributacion')).toBeNull()
    expect(validarDestino('interna', '/')).toBeNull()
  })

  it.each(['guia', '//otro-sitio.com', 'https://sigefact.pse.pe/', '/con espacio'])(
    'rechaza «%s» como ruta interna',
    (destino) => {
      expect(validarDestino('interna', destino)).toMatch(/\/guia/)
    },
  )

  it('acepta un enlace externo https', () => {
    expect(validarDestino('externa', 'https://sigefact.pse.pe/')).toBeNull()
  })

  it.each(['http://sigefact.pse.pe/', 'sigefact.pse.pe', 'javascript:alert(1)', '/guia'])(
    'rechaza «%s» como enlace externo',
    (destino) => {
      expect(validarDestino('externa', destino)).toMatch(/https:\/\//)
    },
  )
})

describe('esUrlHttps', () => {
  it('acepta solo direcciones https con dominio', () => {
    expect(esUrlHttps('https://www.youtube.com/channel/UC_3EI0DpkhlLKGBGfvY2oXg')).toBe(true)
    expect(esUrlHttps('http://www.facebook.com/')).toBe(false)
    expect(esUrlHttps('https://')).toBe(false)
    expect(esUrlHttps('')).toBe(false)
  })
})
