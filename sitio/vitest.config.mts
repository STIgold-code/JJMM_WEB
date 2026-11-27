import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Pruebas de unidad: sin base de datos ni navegador. Los componentes de servidor se
// prueban dibujándolos a HTML con react-dom/server.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
