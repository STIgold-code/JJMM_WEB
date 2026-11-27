import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { menuDelPanel } from '../../dominio/menu-del-panel'

vi.mock('next/navigation', () => ({ usePathname: () => '/panel' }))

const { NavegacionDelMenu } = await import('./navegacion-del-menu')

const dibujar = (rol: 'administrador' | 'editor', mensajesNuevos: number | null = 0) =>
  renderToStaticMarkup(<NavegacionDelMenu grupos={menuDelPanel(rol, { mensajesNuevos })} />)

describe('NavegacionDelMenu', () => {
  it('el único enlace es el inicio, marcado como página actual', () => {
    const html = dibujar('administrador')
    expect(html.match(/<a /g)).toHaveLength(1)
    expect(html).toMatch(/<a aria-current="page"[^>]*href="\/panel"/)
  })

  it('las secciones pendientes se ven deshabilitadas con «Próximamente», sin enlace', () => {
    const html = dibujar('administrador')
    expect(html).toMatch(/aria-disabled="true"[^>]*>.*Planes.*Próximamente/)
    expect(html).not.toContain('href="#"')
  })

  it('el editor no ve la sección de administración', () => {
    expect(dibujar('editor')).not.toContain('Usuarios')
    expect(dibujar('administrador')).toContain('Usuarios')
  })

  it('muestra el contador de mensajes nuevos con un texto para lectores de pantalla', () => {
    expect(dibujar('editor', 4)).toContain('4<span class="sr-only"> sin atender</span>')
    expect(dibujar('editor', 0)).not.toContain('sin atender')
  })
})
