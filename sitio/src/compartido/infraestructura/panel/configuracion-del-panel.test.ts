import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import type { Block, CollectionConfig, Field, GlobalConfig } from 'payload'
import { describe, expect, it, vi } from 'vitest'

vi.mock('next/cache', () => ({ revalidateTag: vi.fn(), unstable_cache: vi.fn() }))

import { COLECCIONES, GLOBALES } from '@/contenido'
import { globalPaginaDeInicio } from '@/modulos/portada/infraestructura/global-pagina-de-inicio'

import { ADMIN_DEL_PANEL, I18N_DEL_PANEL } from './configuracion-del-panel'
import { ORDEN_DE_GRUPOS } from './grupos-del-panel'

// `importMap.baseDir` es `src/`: las rutas de los componentes del panel parten de ahí.
const RAIZ_DE_COMPONENTES = fileURLToPath(new URL('../../..', import.meta.url))
const GRUPOS = new Set<string>(ORDEN_DE_GRUPOS)

// Ayuda para quien edita: una oración completa en español, no una etiqueta suelta.
function esAyudaLegible(texto: unknown): boolean {
  return typeof texto === 'string' && texto.length >= 30 && /[.»)]$/.test(texto.trim())
}

const descripcionDe = (entidad: CollectionConfig | GlobalConfig): unknown =>
  entidad.admin?.description

const camposConNombre = (campos: readonly Field[]) =>
  campos.filter((campo): campo is Field & { name: string } => 'name' in campo)

function bloquesDelInicio(): Block[] {
  const secciones = camposConNombre(globalPaginaDeInicio.fields).find(
    ({ name }) => name === 'secciones',
  )
  return secciones?.type === 'blocks' ? secciones.blocks : []
}

describe('panel: colecciones', () => {
  it.each(COLECCIONES.map((coleccion) => [coleccion.slug, coleccion] as const))(
    '%s tiene etiquetas, grupo permitido y descripción para quien edita',
    (_slug, coleccion) => {
      expect(coleccion.labels?.singular).toBeTruthy()
      expect(coleccion.labels?.plural).toBeTruthy()
      expect(GRUPOS.has(String(coleccion.admin?.group))).toBe(true)
      expect(esAyudaLegible(descripcionDe(coleccion))).toBe(true)
    },
  )

  it.each(COLECCIONES.map((coleccion) => [coleccion.slug, coleccion] as const))(
    '%s permite buscar en la lista por su título',
    (_slug, coleccion) => {
      const campos = coleccion.admin?.listSearchableFields ?? []
      expect(campos.length).toBeGreaterThan(0)
      const titulo = coleccion.admin?.useAsTitle
      if (titulo) expect(campos).toContain(titulo)
    },
  )
})

describe('panel: globales', () => {
  it.each(GLOBALES.map((global) => [global.slug, global] as const))(
    '%s tiene etiqueta, grupo permitido y descripción para quien edita',
    (_slug, global) => {
      expect(global.label).toBeTruthy()
      expect(GRUPOS.has(String(global.admin?.group))).toBe(true)
      expect(esAyudaLegible(descripcionDe(global))).toBe(true)
    },
  )
})

describe('panel: menú lateral', () => {
  it('muestra los grupos en el orden en que piensa quien edita', () => {
    const grupos = [...COLECCIONES, ...GLOBALES].map((entidad) => String(entidad.admin?.group))
    expect([...new Set(grupos)]).toEqual([...ORDEN_DE_GRUPOS])
  })
})

describe('panel: bloques de la página de inicio', () => {
  it.each(bloquesDelInicio().map((bloque) => [bloque.slug, bloque] as const))(
    'el bloque %s explica qué muestra y dónde',
    (_slug, bloque) => {
      expect(bloque.labels?.singular).toBeTruthy()
      const principal = camposConNombre(bloque.fields).find(({ name }) =>
        ['titulo', 'portadas'].includes(name),
      )
      const admin = principal?.admin
      expect(esAyudaLegible(admin && 'description' in admin ? admin.description : null)).toBe(true)
    },
  )
})

describe('panel: idioma y marca', () => {
  it('usa solo español, también como idioma de respaldo', () => {
    expect(Object.keys(I18N_DEL_PANEL.supportedLanguages ?? {})).toEqual(['es'])
    expect(I18N_DEL_PANEL.fallbackLanguage).toBe('es')
  })

  it('agrega el nombre del estudio al título de cada pestaña', () => {
    expect(ADMIN_DEL_PANEL.meta?.titleSuffix).toMatch(/JJMM/)
  })

  it.each([
    ['Logo', ADMIN_DEL_PANEL.components?.graphics?.Logo],
    ['Icon', ADMIN_DEL_PANEL.components?.graphics?.Icon],
    ['beforeDashboard', ADMIN_DEL_PANEL.components?.beforeDashboard?.[0]],
  ])('el componente %s apunta a un archivo existente', (_nombre, componente) => {
    expect(typeof componente).toBe('string')
    const [ruta = ''] = String(componente).split('#')
    expect(existsSync(path.join(RAIZ_DE_COMPONENTES, `${ruta}.tsx`))).toBe(true)
  })
})
