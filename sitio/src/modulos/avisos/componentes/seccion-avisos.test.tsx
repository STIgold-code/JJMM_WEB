import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { AvisoPublico } from '../dominio/aviso'
import { SeccionAvisos } from './seccion-avisos'

const aviso = (titulo: string, correo = true): AvisoPublico => ({
  titulo,
  parrafos: ['Inicia del 1.º al 5.º día útil de cada mes.', 'Se toma 03 días hábiles.'],
  documentos: ['Comprobantes de compras', 'Estados de cuenta bancarios'],
  correo: correo
    ? { texto: 'contabilidad@jjmm.com.pe', href: 'mailto:contabilidad@jjmm.com.pe' }
    : null,
})

const dibujar = (avisos: AvisoPublico[]) =>
  renderToStaticMarkup(<SeccionAvisos titulo="Avisos para clientes" avisos={avisos} />)

describe('SeccionAvisos', () => {
  it('es una sección con nombre accesible y su título', () => {
    const html = dibujar([aviso('Cierre tributario')])

    expect(html).toMatch(/<section id="avisos"[^>]*aria-labelledby="titulo-avisos"/)
    expect(html).toMatch(/<h2 id="titulo-avisos"[^>]*>Avisos para clientes<\/h2>/)
  })

  it('dibuja cada aviso como texto: título, párrafos y lista de documentos', () => {
    const html = dibujar([aviso('Cierre tributario'), aviso('Cierre de planilla')])

    expect(html.indexOf('Cierre tributario')).toBeLessThan(html.indexOf('Cierre de planilla'))
    expect(html).toContain('<p>Se toma 03 días hábiles.</p>')
    expect(html).toContain('<li>Estados de cuenta bancarios</li>')
    expect(html).not.toContain('<img')
  })

  it('enlaza el correo de contacto con mailto', () => {
    const html = dibujar([aviso('Cierre tributario')])

    expect(html).toContain('<a href="mailto:contabilidad@jjmm.com.pe">contabilidad@jjmm.com.pe</a>')
  })

  it('omite el correo si el aviso no lo tiene', () => {
    expect(dibujar([aviso('Cierre tributario', false)])).not.toContain('mailto:')
  })

  it('escalona la aparición de las tarjetas', () => {
    const html = dibujar([aviso('Cierre tributario'), aviso('Cierre de planilla')])

    expect(html).toMatch(/<article class="[^"]*revelar"/)
    expect(html).toContain('--retraso:0.15s')
  })

  it('no se dibuja si no hay avisos visibles', () => {
    expect(dibujar([])).toBe('')
  })
})
