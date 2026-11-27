import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import ErrorDelPanel from './error'

const dibujar = () => {
  const error = Object.assign(new Error('relation "mensajes" does not exist at /srv/app'), {
    digest: '123',
  })
  return renderToStaticMarkup(<ErrorDelPanel error={error} reset={() => undefined} />)
}

describe('ErrorDelPanel', () => {
  it('explica en español, ofrece reintentar y volver al inicio', () => {
    const html = dibujar()
    expect(html).toContain('No pudimos mostrar esta pantalla')
    expect(html).toMatch(/<button[^>]*>.*Reintentar/)
    expect(html).toMatch(/href="\/panel"/)
  })

  it('no muestra el mensaje ni la traza del error', () => {
    const html = dibujar()
    expect(html).not.toContain('relation')
    expect(html).not.toContain('/srv/app')
    expect(html).not.toContain('Error:')
  })
})
