import { ESLint } from 'eslint'
import { fileURLToPath } from 'node:url'
import { beforeAll, describe, expect, it } from 'vitest'

// Las capas del panel propio (`src/panel/`) cumplen los mismos límites que los módulos, más la
// capa `acciones/` (server actions), que es externa como `infraestructura/`.
const RAIZ_DEL_SITIO = fileURLToPath(new URL('../..', import.meta.url))
const REGLA = 'no-restricted-imports'
const TIEMPO_DE_CARGA_MS = 120_000

let eslint: ESLint

beforeAll(async () => {
  eslint = new ESLint({ cwd: RAIZ_DEL_SITIO })
  await eslint.lintText('export {}\n', { filePath: 'src/panel/calentamiento.ts' })
}, TIEMPO_DE_CARGA_MS)

async function reglasQueFallan(codigo: string, ruta: string): Promise<string[]> {
  const [resultado] = await eslint.lintText(`${codigo}\nexport {}\n`, { filePath: ruta })
  return (resultado?.messages ?? []).map((mensaje) => mensaje.ruleId ?? 'error-de-analisis')
}

describe('límites de capas del panel', () => {
  it.each([
    "import { getPayload } from 'payload'",
    "import { redirect } from 'next/navigation'",
    "import { ingresarAlPanel } from '../acciones/ingreso'",
    "import { obtenerSesion } from '../infraestructura/sesion-del-panel'",
  ])('dominio rechaza: %s', async (importacion) => {
    expect(await reglasQueFallan(importacion, 'src/panel/dominio/regla.ts')).toContain(REGLA)
  })

  it('aplicacion rechaza las acciones de servidor', async () => {
    const codigo = "import { salirDelPanel } from '../acciones/salida'"
    expect(await reglasQueFallan(codigo, 'src/panel/aplicacion/caso.ts')).toContain(REGLA)
  })

  it('componentes rechaza Payload directo', async () => {
    const codigo = "import { getPayload } from 'payload'"
    expect(await reglasQueFallan(codigo, 'src/panel/componentes/vista.tsx')).toContain(REGLA)
  })

  it('componentes acepta acciones de servidor y el dominio', async () => {
    const codigo = [
      "import { ingresarAlPanel } from '../acciones/ingreso'",
      "import { menuDelPanel } from '../dominio/menu-del-panel'",
    ].join('\n')
    expect(await reglasQueFallan(codigo, 'src/panel/componentes/vista.tsx')).not.toContain(REGLA)
  })
})
