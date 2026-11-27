import { existsSync } from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

import { validarDestino } from '@/compartido/dominio/destino-de-enlace'
import { validarTextoResaltado } from '@/modulos/portada/dominio/texto-resaltado'
import {
  esCodigoDeAreaValido,
  esListaDePuntosValida,
} from '@/modulos/servicios/dominio/area-de-servicio'

import { SEMILLA } from '.'
import { claveDeMedio, clavesDeMedioReferenciadas } from './medios-referenciados'

const RAIZ_DEL_REPOSITORIO = path.resolve(process.cwd(), '..')
const TIPOS_CON_DESTINO = ['seccion', 'interna', 'externa'] as const

describe('semilla: áreas de servicio', () => {
  it('carga P1 a P9 en orden, con código válido', () => {
    const codigos = SEMILLA.areas.map((area) => area.codigo)

    expect(codigos).toEqual(['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9'])
    expect(codigos.every(esCodigoDeAreaValido)).toBe(true)
  })

  it('cada área tiene su gajo válido en la rueda, descripción y puntos', () => {
    for (const area of SEMILLA.areas) {
      expect(esListaDePuntosValida(area.poligonoEnLaRueda ?? ''), area.codigo).toBe(true)
      expect(area.descripcion).not.toBe('')
      expect(area.puntos?.length ?? 0).toBeGreaterThan(0)
    }
  })
})

describe('semilla: portadas del inicio (S5)', () => {
  const { portadas } = SEMILLA.paginaDeInicio.carrusel

  it('conserva las cuatro portadas de la v4', () => {
    expect(portadas).toHaveLength(4)
    expect(portadas[0]?.titulo).toBe('Contamos con [Sistema de Calidad] Genuino')
  })

  it('los títulos marcan el resaltado con corchetes válidos', () => {
    for (const { titulo } of portadas) {
      expect(validarTextoResaltado(titulo ?? '')).toBeNull()
    }
  })

  it('los botones que enlazan tienen un destino válido', () => {
    const acciones = portadas.flatMap((portada) => portada.acciones ?? [])
    for (const accion of acciones) {
      const tipo = TIPOS_CON_DESTINO.find((t) => t === accion.tipo)
      if (tipo) expect(validarDestino(tipo, accion.destino ?? ''), accion.etiqueta).toBeNull()
    }
  })
})

describe('semilla: medios', () => {
  it('cada medio referenciado existe en la lista de medios', () => {
    const disponibles = new Set(SEMILLA.medios.map((medio) => claveDeMedio(medio.archivo)))
    const faltantes = clavesDeMedioReferenciadas(SEMILLA).filter((c) => !disponibles.has(c))

    expect(faltantes).toEqual([])
  })

  it('los archivos de los medios existen y no repiten nombre', () => {
    const claves = SEMILLA.medios.map((medio) => claveDeMedio(medio.archivo))

    expect(new Set(claves).size).toBe(claves.length)
    for (const { archivo } of SEMILLA.medios) {
      expect(existsSync(path.join(RAIZ_DEL_REPOSITORIO, archivo)), archivo).toBe(true)
    }
  })

  it('cada medio tiene texto alternativo', () => {
    expect(SEMILLA.medios.filter((medio) => medio.alt.trim() === '')).toEqual([])
  })
})

describe('semilla: clientes y valores', () => {
  it('carga los 11 logotipos de clientes, uno por cliente', () => {
    const logos = SEMILLA.clientes.map((cliente) => cliente.logo)

    expect(logos).toHaveLength(11)
    expect(new Set(logos).size).toBe(11)
  })

  it('carga los seis valores declarados', () => {
    expect(SEMILLA.valores.map((valor) => valor.nombre)).toEqual([
      'Excelencia',
      'Compromiso',
      'Innovación',
      'Confidencialidad',
      'Equidad',
      'Trabajo en equipo',
    ])
  })
})
