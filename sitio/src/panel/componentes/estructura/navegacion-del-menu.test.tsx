import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

import { menuDelPanel } from '../../dominio/menu-del-panel'

const ruta = vi.hoisted(() => ({ actual: '/panel' }))

vi.mock('next/navigation', () => ({ usePathname: () => ruta.actual }))

const { NavegacionDelMenu } = await import('./navegacion-del-menu')

const dibujar = (rol: 'administrador' | 'editor', mensajesNuevos: number | null = 0) =>
  renderToStaticMarkup(<NavegacionDelMenu grupos={menuDelPanel(rol, { mensajesNuevos })} />)

describe('NavegacionDelMenu', () => {
  it('los enlaces son el inicio (página actual), los mensajes, los planes, las sedes, la guía y, para el administrador, los usuarios', () => {
    const html = dibujar('administrador')
    expect(html.match(/<a /g)).toHaveLength(6)
    expect(html).toMatch(/<a aria-current="page"[^>]*href="\/panel"/)
    expect(html).toMatch(/<a [^>]*href="\/panel\/mensajes"/)
    expect(html).toMatch(/<a [^>]*href="\/panel\/planes"/)
    expect(html).toMatch(/<a [^>]*href="\/panel\/sedes"/)
    expect(html).toMatch(/<a [^>]*href="\/panel\/guia"/)
    expect(html).toMatch(/<a [^>]*href="\/panel\/usuarios"/)
    expect(html).not.toMatch(/<a aria-current="page"[^>]*href="\/panel\/mensajes"/)
    expect(dibujar('editor').match(/<a /g)).toHaveLength(5)
  })

  it('las secciones pendientes se ven deshabilitadas con «Próximamente», sin enlace', () => {
    const html = dibujar('administrador')
    expect(html).toMatch(/aria-disabled="true"[^>]*>.*Áreas de servicio.*Próximamente/)
    expect(html).not.toContain('href="#"')
  })

  it('en la edición de un plan, «Planes» queda marcado y el inicio no', () => {
    ruta.actual = '/panel/planes/7'
    const html = dibujar('editor')
    ruta.actual = '/panel'
    expect(html).toMatch(/<a aria-current="page"[^>]*href="\/panel\/planes"/)
    expect(html).not.toMatch(/<a aria-current="page"[^>]*href="\/panel"/)
  })

  it('en la edición de una sede, «Sedes» queda marcado', () => {
    ruta.actual = '/panel/sedes/2'
    const html = dibujar('editor')
    ruta.actual = '/panel'
    expect(html).toMatch(/<a aria-current="page"[^>]*href="\/panel\/sedes"/)
    expect(html.match(/aria-current="page"/g)).toHaveLength(1)
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
