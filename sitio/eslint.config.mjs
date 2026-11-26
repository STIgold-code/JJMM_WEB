import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import prettier from 'eslint-config-prettier/flat'

// Archivos que genera Payload. No se editan a mano, así que no se les aplican reglas.
const ARCHIVOS_GENERADOS = [
  'src/payload-types.ts',
  'src/payload-generated-schema.ts',
  'src/app/(payload)/admin/importMap.js',
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
    // Las rutas de Payload en (payload)/ las genera y reescribe Payload.
    ignores: ['src/app/(payload)/**'],
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
