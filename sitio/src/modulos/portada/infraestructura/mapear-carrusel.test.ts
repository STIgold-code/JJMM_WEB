import { describe, expect, it } from 'vitest'

import type { ContactoDelSitio } from '@/compartido/dominio/configuracion-del-sitio'
import type { BloqueCarruselDePortadas, Medio } from '@/payload-types'

import { mapearCarrusel } from './mapear-carrusel'

const medio = (archivo: string): Medio => ({
  id: 1,
  alt: `Imagen ${archivo}`,
  url: `/api/medios/file/${archivo}`,
  width: 1920,
  height: 968,
  updatedAt: '2026-11-27T00:00:00.000Z',
  createdAt: '2026-11-27T00:00:00.000Z',
})

const CONTACTO: ContactoDelSitio = {
  correo: 'contabilidad@jjmm.com.pe',
  celularWhatsApp: '951965242',
  mensajeWhatsApp: 'Hola.',
  celularDeLlamadas: '952249102',
  textoDelBotonFlotante: 'Escríbenos',
}

type Portada = NonNullable<BloqueCarruselDePortadas['portadas']>[number]

const portada = (cambios: Partial<Portada>): Portada => ({
  imagen: medio('hero-plan.webp'),
  disposicion: 'texto-derecha',
  transicion: 'fundido',
  ...cambios,
})

const bloque = (portadas: Portada[]): BloqueCarruselDePortadas => ({
  blockType: 'carrusel-de-portadas',
  segundosPorPortada: 9,
  portadas,
})

describe('mapearCarrusel', () => {
  it('prepara cada portada con su título resaltado, lista y botones resueltos', () => {
    const carrusel = mapearCarrusel(
      bloque([
        portada({
          titulo: 'Contamos con [Sistema de Calidad] Genuino',
          lista: [{ texto: 'Diagnóstico' }],
          acciones: [{ etiqueta: 'Asesoría', tipo: 'whatsapp', estilo: 'principal' }],
        }),
      ]),
      CONTACTO,
    )

    expect(carrusel?.segundosPorPortada).toBe(9)
    expect(carrusel?.portadas[0]).toMatchObject({
      imagen: { url: '/api/medios/file/hero-plan.webp', ancho: 1920, alto: 968 },
      imagenEsDecorativa: true,
      titulo: [
        { texto: 'Contamos con ', resaltado: false },
        { texto: 'Sistema de Calidad', resaltado: true },
        { texto: ' Genuino', resaltado: false },
      ],
      lista: ['Diagnóstico'],
      acciones: [{ etiqueta: 'Asesoría', href: 'https://wa.me/51951965242?text=Hola.' }],
    })
  })

  it('marca como h1 solo el título de la primera portada que tiene uno', () => {
    const carrusel = mapearCarrusel(
      bloque([
        portada({ disposicion: 'imagen-completa' }),
        portada({ titulo: 'Primero' }),
        portada({ titulo: 'Segundo' }),
      ]),
      CONTACTO,
    )

    expect(carrusel?.portadas.map((p) => p.esTituloPrincipal)).toEqual([false, true, false])
  })

  it('omite las portadas sin imagen y no dibuja un carrusel vacío', () => {
    expect(mapearCarrusel(bloque([portada({ imagen: 4 })]), CONTACTO)).toBeNull()
    expect(mapearCarrusel(bloque([]), CONTACTO)).toBeNull()
  })

  it('sin configuración del sitio no publica botones de WhatsApp ni de llamada', () => {
    const carrusel = mapearCarrusel(
      bloque([
        portada({ acciones: [{ etiqueta: 'Llamar', tipo: 'llamada', estilo: 'principal' }] }),
      ]),
      null,
    )

    expect(carrusel?.portadas[0]?.acciones).toEqual([])
  })
})
