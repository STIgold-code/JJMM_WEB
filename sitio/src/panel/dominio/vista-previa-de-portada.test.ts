import { describe, expect, it } from 'vitest'

import { portadaNueva } from './carrusel-de-portadas'
import { detalleDePortada, nombreDePortada, vistaPreviaDePortada } from './vista-previa-de-portada'

const IMAGEN = {
  id: 7,
  url: '/api/medios/file/a.webp',
  alt: 'A',
  nombre: 'a.webp',
  ancho: 10,
  alto: 5,
}

describe('nombreDePortada', () => {
  it('usa el título sin corchetes o, sin título, su número', () => {
    const portada = { ...portadaNueva(1), titulo: 'Contamos con [Sistema de Calidad] Genuino' }
    expect(nombreDePortada(portada, 0)).toBe('Contamos con Sistema de Calidad Genuino')
    expect(nombreDePortada(portadaNueva(3), 2)).toBe('Portada 3, sin título')
  })
})

describe('detalleDePortada', () => {
  it('dice dónde va el texto y lo que lleva además', () => {
    expect(detalleDePortada({ ...portadaNueva(1), disposicion: 'texto-derecha' })).toBe(
      'Texto a la derecha',
    )
    expect(
      detalleDePortada({
        ...portadaNueva(1),
        disposicion: 'imagen-completa',
        imagenParaCelular: IMAGEN,
      }),
    ).toBe('Imagen completa, con versión para celular')
    expect(detalleDePortada({ ...portadaNueva(1), lista: 'Uno\nDos\n\nTres' })).toBe(
      'Texto a la izquierda · lista de 3 puntos',
    )
  })
})

describe('vistaPreviaDePortada', () => {
  it('resalta lo que va entre corchetes y omite lo vacío', () => {
    const vista = vistaPreviaDePortada({
      ...portadaNueva(1),
      imagen: IMAGEN,
      titulo: 'Somos más que un [estudio contable]',
      lista: 'Uno\n \nDos',
      botones: [
        {
          clave: 1,
          etiqueta: ' Asesoría ',
          tipo: 'whatsapp',
          mensaje: '',
          destino: '',
          estilo: 'principal',
        },
        {
          clave: 2,
          etiqueta: '  ',
          tipo: 'seccion',
          mensaje: '',
          destino: '#planes',
          estilo: 'secundario',
        },
      ],
    })
    expect(vista).toMatchObject({
      imagen: IMAGEN.url,
      titulo: [
        { texto: 'Somos más que un ', resaltado: false },
        { texto: 'estudio contable', resaltado: true },
      ],
      subtitulo: null,
      lista: ['Uno', 'Dos'],
      botones: [{ etiqueta: 'Asesoría', estilo: 'principal' }],
    })
  })

  it('un título con corchetes mal cerrados se ve sin resaltar', () => {
    expect(vistaPreviaDePortada({ ...portadaNueva(1), titulo: 'Sin [cerrar' }).titulo).toEqual([
      { texto: 'Sin [cerrar', resaltado: false },
    ])
  })
})
