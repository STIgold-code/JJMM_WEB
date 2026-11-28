import { describe, expect, it } from 'vitest'

import { ERROR_DE_FORMULARIO } from './formularios'
import {
  ERROR_DE_ENCUADRE,
  ERROR_DE_SEGUNDOS,
  ERROR_DESTINO_VACIO,
  ERROR_ETIQUETA_VACIA,
  ERROR_SIN_IMAGEN,
  ERROR_SIN_PORTADAS,
} from './errores-del-carrusel'
import { idsDeImagenes, validarFormularioDelCarrusel } from './validacion-del-carrusel'

const IMAGEN = { id: 7, url: '/api/medios/file/a.webp', alt: 'A', nombre: 'a.webp' }

const BOTON = {
  clave: 1,
  etiqueta: ' Ver nuestros planes ',
  tipo: 'seccion',
  mensaje: 'no se usa',
  destino: ' #planes ',
  estilo: 'secundario',
}

const PORTADA = {
  clave: 1,
  imagen: IMAGEN,
  imagenEsDecorativa: false,
  imagenParaCelular: null,
  encuadreEnCelular: 22,
  disposicion: 'texto-derecha',
  transicion: 'fundido',
  titulo: ' Contamos con [Sistema de Calidad] Genuino ',
  subtitulo: '',
  sello: { ...IMAGEN, id: 9 },
  lista: 'Uno\n\n  Dos  \n',
  botones: [BOTON],
}

const FORMULARIO = {
  seccion: 'a1',
  actualizadoEn: '2026-11-27T10:00:00.000Z',
  segundosPorPortada: '9',
  portadas: [PORTADA],
}

describe('validarFormularioDelCarrusel', () => {
  it('normaliza lo que se guarda: ids de imagen, textos recortados, lista por línea', () => {
    const resultado = validarFormularioDelCarrusel(FORMULARIO)
    expect(resultado).toEqual({
      valido: true,
      datos: {
        seccion: 'a1',
        actualizadoEn: '2026-11-27T10:00:00.000Z',
        segundosPorPortada: 9,
        portadas: [
          {
            imagen: 7,
            imagenEsDecorativa: false,
            imagenParaCelular: null,
            encuadreEnCelular: 22,
            disposicion: 'texto-derecha',
            transicion: 'fundido',
            titulo: 'Contamos con [Sistema de Calidad] Genuino',
            subtitulo: null,
            sello: 9,
            lista: ['Uno', 'Dos'],
            // El mensaje solo se guarda en un botón de WhatsApp.
            botones: [
              {
                etiqueta: 'Ver nuestros planes',
                tipo: 'seccion',
                mensaje: null,
                destino: '#planes',
                estilo: 'secundario',
              },
            ],
          },
        ],
      },
    })
  })

  it('un botón de WhatsApp guarda su mensaje y no un destino', () => {
    const boton = { ...BOTON, tipo: 'whatsapp', mensaje: ' Hola ', destino: '#planes' }
    const resultado = validarFormularioDelCarrusel({
      ...FORMULARIO,
      portadas: [{ ...PORTADA, botones: [boton] }],
    })
    expect(resultado.valido && resultado.datos.portadas[0]?.botones[0]).toMatchObject({
      mensaje: 'Hola',
      destino: null,
    })
  })

  it('rechaza cero portadas: el inicio se quedaría sin su imagen principal', () => {
    expect(validarFormularioDelCarrusel({ ...FORMULARIO, portadas: [] })).toEqual({
      valido: false,
      errores: { portadas: ERROR_SIN_PORTADAS },
    })
  })

  it('cada error va a su portada y a su campo', () => {
    const mala = {
      ...PORTADA,
      imagen: null,
      encuadreEnCelular: 140,
      titulo: 'Sin [cerrar',
      botones: [
        { ...BOTON, etiqueta: ' ', destino: '' },
        { ...BOTON, clave: 2, destino: 'planes' },
      ],
    }
    const resultado = validarFormularioDelCarrusel({
      ...FORMULARIO,
      segundosPorPortada: '2',
      portadas: [PORTADA, mala],
    })
    expect(resultado.valido).toBe(false)
    if (resultado.valido) return
    expect(resultado.errores.segundos).toBe(ERROR_DE_SEGUNDOS)
    expect(resultado.errores.portada?.[0]).toBeUndefined()
    expect(resultado.errores.portada?.[1]).toMatchObject({
      imagen: ERROR_SIN_IMAGEN,
      encuadre: ERROR_DE_ENCUADRE,
      titulo: expect.stringContaining('corchetes'),
      boton: {
        0: { etiqueta: ERROR_ETIQUETA_VACIA, destino: ERROR_DESTINO_VACIO },
        1: { destino: expect.stringContaining('#planes') },
      },
    })
  })

  it('una forma inesperada (tipos, valores fuera de las opciones, campos de más) es un error general', () => {
    const casos = [
      null,
      { ...FORMULARIO, actualizadoEn: 'ayer' },
      { ...FORMULARIO, seccion: '../otra' },
      { ...FORMULARIO, portadas: [{ ...PORTADA, disposicion: 'centro' }] },
      { ...FORMULARIO, portadas: [{ ...PORTADA, imagen: { id: 'x' } }] },
      { ...FORMULARIO, portadas: [{ ...PORTADA, botones: [{ ...BOTON, tipo: 'javascript' }] }] },
      { ...FORMULARIO, portadas: [{ ...PORTADA, botones: [BOTON, BOTON, BOTON] }] },
    ]
    for (const caso of casos)
      expect(validarFormularioDelCarrusel(caso)).toEqual({
        valido: false,
        errores: { general: ERROR_DE_FORMULARIO },
      })
  })
})

describe('idsDeImagenes', () => {
  it('lista sin repetir las imágenes que usa el carrusel', () => {
    const resultado = validarFormularioDelCarrusel({
      ...FORMULARIO,
      portadas: [PORTADA, { ...PORTADA, clave: 2, sello: null, imagenParaCelular: IMAGEN }],
    })
    expect(resultado.valido && idsDeImagenes(resultado.datos)).toEqual([7, 9])
  })
})
