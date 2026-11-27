import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

// La acción del servidor importa Payload; en la prueba de dibujo basta un doble.
vi.mock('./enviar-mensaje-de-contacto', () => ({ enviarMensajeDeContacto: vi.fn() }))

const { FormularioDeContacto } = await import('./formulario-de-contacto')
const { AvisoDeEnvio } = await import('./aviso-de-envio')

const dibujar = () =>
  renderToStaticMarkup(
    <FormularioDeContacto
      titulo="Escríbenos"
      texto="Completa tus datos."
      textoDelBoton="Enviar por WhatsApp"
      opcionesDeServicio={['Asesoría tributaria', 'Asesoría legal']}
      celularWhatsApp="951965242"
    />,
  )

describe('FormularioDeContacto', () => {
  it('etiqueta cada campo y valida con las reglas del dominio, no con las del navegador', () => {
    const html = dibujar()

    expect(html.toLowerCase()).toContain('novalidate=""')
    expect(html).toMatch(
      /<label for="([^"]+-nombre)">Nombre y apellido<\/label><input id="\1"[^>]*name="nombre"/,
    )
    expect(html).toMatch(/<label for="[^"]+-celular">Celular<\/label><input [^>]*type="tel"/)
    expect(html).toMatch(/<label for="[^"]+-correo">Correo \(opcional\)<\/label>/)
    expect(html).toMatch(/<label for="[^"]+-mensaje">Cuéntanos tu caso<\/label><textarea/)
    expect(html).toContain('<option>Asesoría tributaria</option>')
  })

  it('no marca errores al empezar', () => {
    const html = dibujar()

    expect(html).not.toContain('aria-invalid="true"')
    expect(html).not.toContain('aria-describedby')
  })

  it('esconde la trampa para robots de la vista y del teclado', () => {
    expect(dibujar()).toMatch(
      /aria-hidden="true"><label>[^<]*<input [^>]*tabindex="-1"[^>]*name="sitioWeb"/,
    )
  })

  it('tiene su título, el botón de envío y una región viva para el resultado', () => {
    const html = dibujar()

    expect(html).toMatch(/aria-labelledby="([^"]+-titulo)"[^>]*><h3 id="\1">Escríbenos<\/h3>/)
    expect(html).toMatch(/type="submit">.*Enviar por WhatsApp<\/button>/)
    expect(html).toContain('role="status"></p>')
  })
})

describe('AvisoDeEnvio', () => {
  it('anuncia el resultado y ofrece abrir WhatsApp si el navegador bloqueó la pestaña', () => {
    const html = renderToStaticMarkup(
      <AvisoDeEnvio estado="enviado" enlace="https://wa.me/51951965242?text=Hola" />,
    )

    expect(html).toContain('Recibimos tus datos.')
    expect(html).toContain(
      '<a href="https://wa.me/51951965242?text=Hola" target="_blank" rel="noopener">Abrir WhatsApp',
    )
  })

  it('explica el límite de envíos y el error al guardar', () => {
    expect(renderToStaticMarkup(<AvisoDeEnvio estado="limite" enlace={null} />)).toContain(
      'varios mensajes seguidos',
    )
    expect(renderToStaticMarkup(<AvisoDeEnvio estado="error" enlace={null} />)).toContain(
      'No pudimos guardar',
    )
  })
})
