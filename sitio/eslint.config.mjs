import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

// Archivos que genera Payload. No se editan a mano, así que no se les aplican reglas.
const ARCHIVOS_GENERADOS = [
  'src/payload-types.ts',
  'src/payload-generated-schema.ts',
  'src/app/(payload)/admin/importMap.js',
  // Migraciones que escribe `payload migrate:create`.
  'src/migrations/**',
]

// Límites entre capas (docs/adr/0001-arquitectura.md): las dependencias apuntan hacia adentro.
const PAYLOAD = {
  regex: '^(payload|@payloadcms/.+|@payload-config)(/.*)?$|(^|/)payload-types$',
  message: 'Esta capa no depende de Payload: usa una interfaz de repositorio.',
}
const PAYLOAD_EN_INTERFAZ = {
  regex: '^(payload|@payloadcms/.+|@payload-config)(/.*)?$',
  message:
    'La interfaz no usa Payload directo: obtén los datos con un adaptador de infraestructura.',
}
const REACT_Y_NEXT = {
  regex: '^(react|react-dom|next)(/.*)?$',
  message: 'Esta capa es TypeScript puro: sin React ni Next.',
}
const capasExternas = (capas) => ({
  regex: `(^|/)(${capas.join('|')})(/|$)`,
  message: 'Las dependencias apuntan hacia adentro: esta capa no importa capas externas.',
})
const restringir = (...patterns) => ({ 'no-restricted-imports': ['error', { patterns }] })

// `acciones/` (server actions del panel propio, `src/panel/`) es una capa externa, como
// `infraestructura/`: puede usar Payload y Next, y el dominio y la aplicación no la importan.
const LIMITES_DE_CAPAS = [
  {
    files: ['src/**/dominio/**/*.{ts,tsx}'],
    rules: restringir(
      PAYLOAD,
      REACT_Y_NEXT,
      capasExternas(['aplicacion', 'infraestructura', 'componentes', 'acciones']),
    ),
  },
  {
    files: ['src/**/aplicacion/**/*.{ts,tsx}'],
    rules: restringir(
      PAYLOAD,
      REACT_Y_NEXT,
      capasExternas(['infraestructura', 'componentes', 'acciones']),
    ),
  },
  {
    files: ['src/**/componentes/**/*.{ts,tsx}'],
    rules: restringir(PAYLOAD_EN_INTERFAZ),
  },
]

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Límites contra los God Components (reglas de ingeniería, S8).
    files: ['src/**/*.{ts,tsx}'],
    // Las rutas de Payload en (payload)/ las genera y reescribe Payload. Las primitivas de
    // shadcn/ui (`src/panel/componentes/ui/`) las genera su CLI y se actualizan con ella.
    ignores: ['src/app/(payload)/**', 'src/panel/componentes/ui/**'],
    rules: {
      'max-lines': ['error', { max: 150, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'error',
        { max: 40, skipBlankLines: true, skipComments: true, IIFEs: true },
      ],
      complexity: ['error', 10],
    },
  },
  {
    // Los bloques describe() de las pruebas agrupan varios casos y superan las 40 líneas
    // sin que eso indique una función con demasiadas responsabilidades.
    files: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    rules: {
      'max-lines-per-function': 'off',
    },
  },
  ...LIMITES_DE_CAPAS,
  prettier,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    '.lighthouseci/**',
    ...ARCHIVOS_GENERADOS,
  ]),
])

export default eslintConfig
