import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { describe, expect, it } from 'vitest'

import { relacionDeContraste } from './contraste'

// Los colores del panel viven en un solo lugar, `_tokens.scss`. La prueba los lee de ahí, así
// un cambio de color que rompa el contraste falla aquí antes de llegar al panel.
const TOKENS = readFileSync(
  fileURLToPath(new URL('../../../app/(payload)/estilos/_tokens.scss', import.meta.url)),
  'utf8',
)

function bloque(selector: string): string {
  const inicio = TOKENS.indexOf(`${selector} {`)
  if (inicio < 0) throw new Error(`Falta el bloque ${selector} en _tokens.scss`)
  return TOKENS.slice(inicio, TOKENS.indexOf('}', inicio))
}

function tokensDe(css: string): Map<string, string> {
  const pares = [...css.matchAll(/--(jjmm-[a-z-]+):\s*(#[0-9a-f]{3,6})\s*;/gi)]
  return new Map(pares.map(([, nombre = '', valor = '']) => [nombre, valor]))
}

const CLARO = tokensDe(bloque(':root'))
const OSCURO = new Map([...CLARO, ...tokensDe(bloque("html[data-theme='dark']"))])

function color(tema: Map<string, string>, nombre: string): string {
  const valor = tema.get(nombre)
  if (!valor) throw new Error(`Falta --${nombre}`)
  return valor
}

// [texto o elemento, fondo, mínimo]: 4,5 para texto normal, 3 para bordes y elementos gráficos.
const PARES: readonly (readonly [string, string, number])[] = [
  ['jjmm-sobre-acento', 'jjmm-acento', 4.5],
  ['jjmm-sobre-acento', 'jjmm-acento-hover', 4.5],
  ['jjmm-noche', 'jjmm-amarillo', 4.5],
  ['jjmm-noche', 'jjmm-amarillo-hondo', 4.5],
  ['jjmm-sobre-noche', 'jjmm-noche', 4.5],
  ['jjmm-sobre-noche-suave', 'jjmm-noche', 4.5],
  ['jjmm-sobre-noche', 'jjmm-noche-hover', 4.5],
  ['jjmm-amarillo', 'jjmm-noche', 3],
  ['jjmm-enlace', 'jjmm-fondo', 4.5],
  ['jjmm-enlace', 'jjmm-fondo-elevado', 4.5],
  ['jjmm-foco', 'jjmm-fondo', 3],
  ['jjmm-acento', 'jjmm-fondo', 3],
  ['jjmm-sobre-tenue', 'jjmm-tenue', 4.5],
  ['jjmm-enlace', 'jjmm-tenue', 4.5],
]

describe.each([
  ['claro', CLARO],
  ['oscuro', OSCURO],
])('colores del panel, tema %s', (_tema, tema) => {
  it.each(PARES.map(([texto, fondo, minimo]) => [texto, fondo, minimo] as const))(
    '--%s sobre --%s cumple %s:1',
    (texto, fondo, minimo) => {
      expect(relacionDeContraste(color(tema, texto), color(tema, fondo))).toBeGreaterThanOrEqual(
        minimo,
      )
    },
  )
})
