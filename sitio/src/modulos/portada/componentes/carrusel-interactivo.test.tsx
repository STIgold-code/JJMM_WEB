import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { CarruselInteractivo, type Diapositiva } from './carrusel-interactivo'

const diapositiva = (texto: string): Diapositiva => ({
  disposicion: 'texto-izquierda',
  transicion: 'izquierda',
  contenido: <p>{texto}</p>,
})

const dibujar = (diapositivas: Diapositiva[]) =>
  renderToStaticMarkup(
    <CarruselInteractivo diapositivas={diapositivas} segundosPorPortada={9} etiqueta="Portadas" />,
  )

describe('CarruselInteractivo', () => {
  it('es la sección #inicio, oscura, con su nombre y la duración de cada portada', () => {
    const html = dibujar([diapositiva('Uno'), diapositiva('Dos')])

    expect(html).toMatch(/^<section id="inicio" class="[^"]* oscuro" style="--duracion:9s"/)
    expect(html).toContain('aria-roledescription="carrusel" aria-label="Portadas"')
  })

  it('muestra la primera portada y deja las demás ocultas e inertes', () => {
    const html = dibujar([diapositiva('Uno'), diapositiva('Dos')])

    expect(html).toMatch(/data-actual="true"[^>]*aria-label="1 de 2" aria-hidden="false"><p>Uno/)
    expect(html).toMatch(
      /data-actual="false"[^>]*aria-label="2 de 2" aria-hidden="true" inert=""><p>Dos/,
    )
  })

  it('no repite la transición de la primera portada al cargar', () => {
    expect(dibujar([diapositiva('Uno'), diapositiva('Dos')])).not.toContain('data-transicion')
  })

  it('ofrece una barra por portada, anterior, siguiente y pausa', () => {
    const html = dibujar([diapositiva('Uno'), diapositiva('Dos')])

    expect(html.match(/Portada \d<\/span>/g)).toEqual(['Portada 1</span>', 'Portada 2</span>'])
    expect(html).toContain('aria-current="true"')
    expect(html).toContain('Portada anterior')
    expect(html).toContain('Portada siguiente')
    expect(html).toMatch(/aria-pressed="false">.*Pausar las portadas/)
  })

  it('con una sola portada no muestra controles', () => {
    expect(dibujar([diapositiva('Uno')])).not.toContain('Portada siguiente')
  })
})
