import { defineConfig, devices } from '@playwright/test'

const PUERTO = Number(process.env.PORT ?? 3000)
const URL_BASE = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PUERTO}`
const EN_CI = Boolean(process.env.CI)

// En CI la aplicación ya compilada se levanta con `pnpm start`. En local se reutiliza
// un servidor que ya esté corriendo, o se levanta `pnpm dev`.
export default defineConfig({
  testDir: './e2e',
  forbidOnly: EN_CI,
  retries: EN_CI ? 2 : 0,
  workers: EN_CI ? 1 : undefined,
  reporter: EN_CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: URL_BASE,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'movil', use: { ...devices['Pixel 7'] } },
    { name: 'escritorio', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: EN_CI ? 'pnpm start' : 'pnpm dev',
    url: URL_BASE,
    reuseExistingServer: !EN_CI,
    timeout: 120_000,
  },
})
