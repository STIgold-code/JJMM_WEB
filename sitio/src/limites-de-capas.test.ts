import { ESLint } from 'eslint'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'

// Prueba la configuración real de ESLint (eslint.config.mjs) contra código en memoria:
// las violaciones nunca existen como archivos del repositorio.
const RAIZ_DEL_SITIO = fileURLToPath(new URL('..', import.meta.url))
const REGLA = 'no-restricted-imports'

// Cargar la configuración de Next y sus plugins tarda varios segundos la primera vez.
const TIEMPO_DE_CARGA_MS = 120_000

let eslint: ESLint

beforeAll(async () => {
  eslint = new ESLint({ cwd: RAIZ_DEL_SITIO })
  await eslint.lintText('export {}\n', { filePath: 'src/calentamiento.ts' })
}, TIEMPO_DE_CARGA_MS)

async function reglasQueFallan(codigo: string, ruta: string): Promise<string[]> {
  const [resultado] = await eslint.lintText(`${codigo}\nexport {}\n`, { filePath: ruta })
  return (resultado?.messages ?? []).map((mensaje) => mensaje.ruleId ?? 'error-de-analisis')
}

const DOMINIO = 'src/modulos/ejemplo/dominio/regla.ts'
const APLICACION = 'src/modulos/ejemplo/aplicacion/caso-de-uso.ts'
const COMPONENTES = 'src/modulos/ejemplo/componentes/seccion.tsx'

describe('límites de capas', () => {
  it.each([
    "import { buildConfig } from 'payload'",
    "import { s3Storage } from '@payloadcms/storage-s3'",
    "import config from '@payload-config'",
    "import type { Usuario } from '@/payload-types'",
    "import { useState } from 'react'",
    "import { renderToString } from 'react-dom/server'",
    "import Link from 'next/link'",
    "import { coleccion } from '../infraestructura/coleccion'",
    "import { Seccion } from '@/modulos/ejemplo/componentes/seccion'",
    "import { listar } from '../aplicacion/listar'",
  ])('dominio rechaza: %s', async (importacion) => {
    expect(await reglasQueFallan(importacion, DOMINIO)).toContain(REGLA)
  })

  it('dominio acepta otro dominio y lo compartido del dominio', async () => {
    const codigo = [
      "import { esCelularPeruano } from '@/compartido/dominio/celular'",
      "import { otraRegla } from './otra-regla'",
    ].join('\n')
    expect(await reglasQueFallan(codigo, DOMINIO)).not.toContain(REGLA)
  })

  it.each([
    "import { getPayload } from 'payload'",
    "import { lexicalEditor } from '@payloadcms/richtext-lexical'",
    "import { cache } from 'react'",
    "import { notFound } from 'next/navigation'",
    "import { adaptador } from '../infraestructura/adaptador'",
    "import { Seccion } from '../componentes/seccion'",
  ])('aplicacion rechaza: %s', async (importacion) => {
    expect(await reglasQueFallan(importacion, APLICACION)).toContain(REGLA)
  })

  it('aplicacion acepta el dominio de su módulo', async () => {
    const codigo = "import { regla } from '../dominio/regla'"
    expect(await reglasQueFallan(codigo, APLICACION)).not.toContain(REGLA)
  })

  it.each([
    "import { getPayload } from 'payload'",
    "import config from '@payload-config'",
    "import { s3Storage } from '@payloadcms/storage-s3'",
  ])('componentes rechaza Payload directo: %s', async (importacion) => {
    expect(await reglasQueFallan(importacion, COMPONENTES)).toContain(REGLA)
  })

  it('componentes acepta React, Next, casos de uso y adaptadores', async () => {
    const codigo = [
      "import Link from 'next/link'",
      "import { cache } from 'react'",
      "import { listar } from '../aplicacion/listar'",
      "import { repositorio } from '../infraestructura/repositorio'",
    ].join('\n')
    expect(await reglasQueFallan(codigo, COMPONENTES)).not.toContain(REGLA)
  })
})
