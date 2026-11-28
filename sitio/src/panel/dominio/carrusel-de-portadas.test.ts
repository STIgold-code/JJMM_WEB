import { describe, expect, it } from 'vitest'

import {
  type CarruselGuardado,
  formularioDelCarrusel,
  hayCambiosEnElCarrusel,
  portadaNueva,
} from './carrusel-de-portadas'
import {
  agregarBoton,
  agregarPortada,
  cambiarPortada,
  moverPortada,
  quitarBoton,
  quitarPortada,
} from './edicion-del-carrusel'

const IMAGEN = {
  id: 7,
  url: '/api/medios/file/hero-plan.webp',
  alt: 'Equipo',
  nombre: 'hero-plan.webp',
  ancho: 1920,
  alto: 900,
}

const GUARDADO: CarruselGuardado = {
  seccion: 'a1',
  actualizadoEn: '2026-11-27T10:00:00.000Z',
  segundosPorPortada: 9,
  portadas: [
    {
      imagen: IMAGEN,
      imagenEsDecorativa: true,
      imagenParaCelular: null,
      encuadreEnCelular: 22,
      disposicion: 'texto-derecha',
      transicion: 'fundido',
      titulo: 'Contamos con [Sistema de Calidad] Genuino',
      subtitulo: 'Cada empresa guiada por nuestro sistema, llega a ser líder.',
      sello: null,
      lista: ['Diagnóstico', 'Plan'],
      botones: [
        {
          etiqueta: 'Asesoría gratuita',
          tipo: 'whatsapp',
          mensaje: null,
          destino: null,
          estilo: 'principal',
        },
      ],
    },
  ],
}

describe('formularioDelCarrusel', () => {
  it('pasa lo guardado al formulario: textos vacíos en vez de null y la lista una por línea', () => {
    const formulario = formularioDelCarrusel(GUARDADO)
    expect(formulario).toMatchObject({ seccion: 'a1', segundosPorPortada: '9' })
    expect(formulario.portadas[0]).toMatchObject({
      clave: 1,
      imagen: IMAGEN,
      encuadreEnCelular: 22,
      lista: 'Diagnóstico\nPlan',
      botones: [{ clave: 1, etiqueta: 'Asesoría gratuita', mensaje: '', destino: '' }],
    })
  })
})

describe('hayCambiosEnElCarrusel', () => {
  const original = formularioDelCarrusel(GUARDADO)

  it('no hay cambios si solo cambian espacios al borde', () => {
    const actual = cambiarPortada(original, 1, {
      titulo: ' Contamos con [Sistema de Calidad] Genuino ',
    })
    expect(hayCambiosEnElCarrusel(original, actual)).toBe(false)
  })

  it('cambiar un texto, una imagen, el orden o los segundos es un cambio', () => {
    expect(
      hayCambiosEnElCarrusel(original, cambiarPortada(original, 1, { subtitulo: 'Otro' })),
    ).toBe(true)
    expect(hayCambiosEnElCarrusel(original, cambiarPortada(original, 1, { sello: IMAGEN }))).toBe(
      true,
    )
    expect(hayCambiosEnElCarrusel(original, { ...original, segundosPorPortada: '10' })).toBe(true)
    const conDos = agregarPortada(original)
    expect(hayCambiosEnElCarrusel(conDos, moverPortada(conDos, 0, 1))).toBe(true)
  })
})

describe('edición de la lista de portadas', () => {
  const original = formularioDelCarrusel(GUARDADO)

  it('una portada nueva va al final, sin imagen, con los valores iniciales del bloque', () => {
    const conDos = agregarPortada(original)
    expect(conDos.portadas).toHaveLength(2)
    expect(conDos.portadas[1]).toEqual(portadaNueva(2))
    expect(portadaNueva(2)).toMatchObject({
      imagen: null,
      imagenEsDecorativa: true,
      disposicion: 'texto-izquierda',
      transicion: 'fundido',
    })
  })

  it('la última portada no se quita', () => {
    expect(quitarPortada(original, 1)).toBe(original)
    const conDos = agregarPortada(original)
    expect(quitarPortada(conDos, 1).portadas.map((p) => p.clave)).toEqual([2])
  })

  it('una portada lleva como máximo dos botones', () => {
    const conDos = agregarBoton(original, 1)
    expect(conDos.portadas[0]?.botones).toHaveLength(2)
    expect(agregarBoton(conDos, 1)).toBe(conDos)
    expect(quitarBoton(conDos, 1, 1).portadas[0]?.botones.map((b) => b.clave)).toEqual([2])
  })
})
