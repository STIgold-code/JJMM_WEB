import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import type { PortadaPublica } from '../dominio/portada'
import { Portada } from './portada'

const IMAGEN = { url: '/api/medios/file/hero-plan.webp', alt: 'Equipo', ancho: 1920, alto: 968 }

const portada = (cambios: Partial<PortadaPublica> = {}): PortadaPublica => ({
  imagen: IMAGEN,
  imagenEsDecorativa: true,
  imagenParaCelular: null,
  encuadreEnCelular: 22,
  disposicion: 'texto-derecha',
  transicion: 'fundido',
  titulo: [
    { texto: 'Contamos con ', resaltado: false },
    { texto: 'Sistema de Calidad', resaltado: true },
  ],
  esTituloPrincipal: true,
  subtitulo: 'Cada empresa guiada por nuestro sistema, llega a ser líder.',
  sello: null,
  lista: [],
  acciones: [],
  ...cambios,
})

const dibujar = (cambios: Partial<PortadaPublica> = {}, primera = true) =>
  renderToStaticMarkup(<Portada portada={portada(cambios)} primera={primera} />)

describe('Portada', () => {
  it('pide la primera imagen con prioridad alta y sin carga diferida (LCP)', () => {
    const html = dibujar()

    expect(html).toContain('fetchPriority="high"')
    expect(html).toContain('sizes="100vw"')
    expect(html).not.toContain('loading="lazy"')
    expect(html).toContain('--movil-x:22%')
  })

  it('carga las demás portadas en diferido', () => {
    const html = dibujar({}, false)

    expect(html).toContain('loading="lazy"')
    expect(html).not.toContain('fetchPriority')
  })

  it('usa h1 solo en el título principal y resalta la parte marcada', () => {
    expect(dibujar()).toMatch(/<h1 class="[^"]*">Contamos con <b>Sistema de Calidad<\/b><\/h1>/)
    expect(dibujar({ esTituloPrincipal: false })).toContain('<h2')
  })

  it('deja vacío el alt de una imagen decorativa y usa el del panel si no lo es', () => {
    expect(dibujar()).toContain('alt=""')
    expect(dibujar({ imagenEsDecorativa: false })).toContain('alt="Equipo"')
  })

  it('dibuja la lista con su ícono y los botones con su estilo', () => {
    const html = dibujar({
      lista: ['Diagnóstico de tu empresa'],
      acciones: [
        {
          etiqueta: 'Pide tu diagnóstico',
          estilo: 'principal',
          href: 'https://wa.me/51951965242',
          icono: 'whatsapp',
          externo: false,
        },
        {
          etiqueta: 'Ver planes',
          estilo: 'secundario',
          href: '#planes',
          icono: null,
          externo: false,
        },
      ],
    })

    expect(html).toContain(
      '<use href="#i-incluido-circulo"></use></svg>Diagnóstico de tu empresa</li>',
    )
    expect(html).toContain('<a class="boton boton-contacto" href="https://wa.me/51951965242">')
    expect(html).toContain('<a class="boton boton-linea" href="#planes">Ver planes</a>')
  })

  it('en una portada de imagen completa usa otra imagen en el celular', () => {
    const html = dibujar({
      disposicion: 'imagen-completa',
      imagenEsDecorativa: false,
      imagenParaCelular: { ...IMAGEN, url: '/api/medios/file/hero-sige-movil.webp' },
    })

    expect(html).toMatch(/<source media="\(max-width: 45\.99rem\)" srcSet="[^"]*hero-sige-movil/)
    expect(html).toContain('alt="Equipo"')
  })
})
