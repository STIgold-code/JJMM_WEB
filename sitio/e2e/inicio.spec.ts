import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test.describe('Página de inicio', () => {
  test('responde y muestra el encabezado principal', async ({ page }) => {
    const respuesta = await page.goto('/')

    expect(respuesta?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('no tiene infracciones de accesibilidad WCAG 2.1 AA', async ({ page }) => {
    await page.goto('/')

    const resultado = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(resultado.violations).toEqual([])
  })
})
