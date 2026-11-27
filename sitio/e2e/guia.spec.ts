import { expect, test } from '@playwright/test'

import { infraccionesDeAccesibilidad } from './accesibilidad'

// Requiere la carga inicial (`pnpm semilla`): sin la global `guia-de-clientes`, /guia da 404.
test.describe('Guía de clientes', () => {
  test('responde con el título de la guía y su canonical', async ({ page }) => {
    const respuesta = await page.goto('/guia')

    expect(respuesta?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/guia$/)
  })

  test('publica los avisos como texto, con su correo de contacto', async ({ page }) => {
    await page.goto('/guia')
    const avisos = page.getByRole('region', { name: 'Avisos para clientes' })

    await expect(
      avisos.getByRole('heading', { name: 'Cierre tributario', exact: true }),
    ).toBeVisible()
    await expect(
      avisos.getByRole('link', { name: 'contabilidad@jjmm.com.pe' }).first(),
    ).toHaveAttribute('href', 'mailto:contabilidad@jjmm.com.pe')
  })

  test('agrupa los vencimientos en mensuales y anuales', async ({ page }) => {
    await page.goto('/guia')
    const vencimientos = page.getByRole('region', { name: 'Vencimientos tributarios' })

    await expect(vencimientos.getByRole('heading', { name: 'Mensuales' })).toBeVisible()
    await expect(vencimientos.getByRole('heading', { name: 'Anuales' })).toBeVisible()
  })

  test('sin cronograma de SUNAT cargado, lo explica en lugar de la consulta', async ({ page }) => {
    await page.goto('/guia')
    const cronograma = page.getByRole('region', { name: 'Cronograma de SUNAT' })

    await expect(cronograma.getByText(/Todavía no publicamos el cronograma de SUNAT/)).toBeVisible()
    await expect(cronograma.getByRole('textbox')).toHaveCount(0)
  })

  test('no tiene infracciones de accesibilidad WCAG 2.1 AA', async ({ page }) => {
    expect(await infraccionesDeAccesibilidad(page, '/guia')).toEqual([])
  })
})
