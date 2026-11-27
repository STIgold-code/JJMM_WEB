import { describe, expect, it } from 'vitest'

import { esCelularPeruano, normalizarCelular } from '@/compartido/dominio/celular'
import { validarDestino } from '@/compartido/dominio/destino-de-enlace'
import { esMapaIncrustadoDeGoogle } from '@/modulos/sedes/dominio/mapa-de-sede'

import { SEMILLA } from '.'
import { recorrerTextos, type TextoEncontrado } from './recorrer-textos'

const CELULARES_PUBLICADOS = ['951965242', '952249102']

// Secuencias de dígitos separadas por espacios, guiones o paréntesis: posibles teléfonos.
const PATRON_NUMERO = /\(?\d[\d\s()-]*\d/g
const MINIMO_DE_DIGITOS_DE_UN_TELEFONO = 6

// Las direcciones (por ejemplo el mapa) y los gajos de la rueda tienen números que no son
// teléfonos.
const puedeTenerTelefonos = ({ ruta, texto }: TextoEncontrado): boolean =>
  !/^https?:\/\//.test(texto) && !ruta.endsWith('poligonoEnLaRueda')

function numerosLargos(texto: string): string[] {
  return Array.from(texto.matchAll(PATRON_NUMERO), ([numero]) => numero.replace(/\D/g, '')).filter(
    (digitos) => digitos.length >= MINIMO_DE_DIGITOS_DE_UN_TELEFONO,
  )
}

describe('semilla: contacto (S9)', () => {
  it('publica solo los celulares 951 965 242 y 952 249 102 en la configuración y las sedes', () => {
    const { contacto } = SEMILLA.configuracion
    const celulares = [
      contacto.celularWhatsApp,
      contacto.celularDeLlamadas,
      ...SEMILLA.sedes.flatMap((sede) => (sede.celulares ?? []).map((c) => c.numero)),
    ]

    expect(celulares.length).toBeGreaterThan(2)
    for (const celular of celulares) {
      expect(esCelularPeruano(celular), celular).toBe(true)
      expect(CELULARES_PUBLICADOS).toContain(normalizarCelular(celular))
    }
  })

  it('ningún texto de la semilla publica un teléfono fijo ni otro número', () => {
    const numeros = recorrerTextos(SEMILLA)
      .filter(puedeTenerTelefonos)
      .flatMap(({ ruta, texto }) => numerosLargos(texto).map((numero) => ({ ruta, numero })))

    const ajenos = numeros.filter(({ numero }) => !CELULARES_PUBLICADOS.includes(numero))
    expect(ajenos).toEqual([])
  })

  it('cada sede tiene dirección, distrito y al menos un celular', () => {
    expect(SEMILLA.sedes.map((sede) => sede.nombre)).toEqual([
      'Sede San Martín de Porres',
      'Sede San Isidro',
    ])
    for (const sede of SEMILLA.sedes) {
      expect(sede.direccion).not.toBe('')
      expect(sede.celulares?.length ?? 0).toBeGreaterThan(0)
    }
  })

  it('el mapa de cada sede, si lo tiene, es un mapa insertado de Google Maps', () => {
    const mapas = SEMILLA.sedes.flatMap((sede) => (sede.enlaceDeMapa ? [sede.enlaceDeMapa] : []))

    expect(mapas.length).toBeGreaterThan(0)
    for (const mapa of mapas) expect(esMapaIncrustadoDeGoogle(mapa), mapa).toBe(true)
  })

  it('el correo general es el publicado en PRODUCT.md', () => {
    expect(SEMILLA.configuracion.contacto.correo).toBe('contabilidad@jjmm.com.pe')
  })

  it('la descripción SEO por defecto no supera 160 caracteres', () => {
    expect(SEMILLA.configuracion.seo.descripcion.length).toBeLessThanOrEqual(160)
  })
})

describe('semilla: navegación (S7)', () => {
  it('cada ítem del menú tiene un destino válido para su tipo', () => {
    for (const item of SEMILLA.navegacion) {
      expect(validarDestino(item.tipo, item.destino ?? ''), item.etiqueta).toBeNull()
    }
  })

  it('SIGEFact es externo, abre en una pestaña nueva y muestra su logo', () => {
    const sigefact = SEMILLA.navegacion.find((item) => item.etiqueta === 'SIGEFact')

    expect(sigefact).toMatchObject({
      tipo: 'externa',
      destino: 'https://sigefact.pse.pe/',
      abrirEnNuevaPestana: true,
      imagen: 'sigefact.png',
    })
  })

  it('la guía de clientes apunta a /guia y no al enlace roto guia_clientes.html', () => {
    const destinos = SEMILLA.navegacion.map((item) => item.destino)

    expect(destinos).toContain('/guia')
    expect(destinos.some((destino) => destino?.includes('guia_clientes'))).toBe(false)
  })

  it('las etiquetas del menú no se repiten', () => {
    const etiquetas = SEMILLA.navegacion.map((item) => item.etiqueta)
    expect(new Set(etiquetas).size).toBe(etiquetas.length)
  })
})
