import { expect, test } from '@playwright/test'

import { infraccionesDeAccesibilidad } from './accesibilidad'

// Requiere la carga inicial (`pnpm semilla`), que el CI ejecuta antes de Playwright.

test.describe('Página de inicio', () => {
  test('responde y muestra el encabezado principal', async ({ page }) => {
    const respuesta = await page.goto('/')

    expect(respuesta?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('no tiene infracciones de accesibilidad WCAG 2.1 AA', async ({ page }) => {
    expect(await infraccionesDeAccesibilidad(page, '/')).toEqual([])
  })

  test('dibuja las secciones del panel en orden', async ({ page }) => {
    await page.goto('/')

    for (const id of ['inicio', 'quienes-somos', 'servicios', 'planes', 'contacto']) {
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    }
    await expect(page.getByRole('heading', { name: '¿Por qué elegirnos?' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Nuestros clientes' })).toBeVisible()
  })
})

test.describe('Hero', () => {
  test('tiene cuatro portadas y avanza con el botón siguiente', async ({ page }) => {
    await page.goto('/')
    const hero = page.locator('#inicio')

    await expect(hero.locator('[aria-roledescription="diapositiva"]')).toHaveCount(4)
    await expect(hero.getByRole('group', { name: '1 de 4' })).toHaveAttribute(
      'aria-hidden',
      'false',
    )

    await hero.getByRole('button', { name: 'Portada siguiente' }).click()

    await expect(hero.getByRole('group', { name: '2 de 4', includeHidden: true })).toHaveAttribute(
      'aria-hidden',
      'false',
    )
  })

  test('se pausa con el botón y con movimiento reducido arranca en pausa', async ({ page }) => {
    await page.goto('/')
    const pausa = page.getByRole('button', { name: 'Pausar las portadas' })

    await expect(pausa).toHaveAttribute('aria-pressed', 'false')
    await pausa.click()
    await expect(pausa).toHaveAttribute('aria-pressed', 'true')

    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.reload()
    await expect(page.getByRole('button', { name: 'Pausar las portadas' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
  })
})

test.describe('Servicios', () => {
  test('las pestañas se recorren con el teclado: abajo salta una fila', async ({ page }) => {
    await page.goto('/')
    const primera = page.getByRole('tab', { name: /P1/ })

    await primera.focus()
    await page.keyboard.press('ArrowDown')

    const cuarta = page.getByRole('tab', { name: /P4/ })
    await expect(cuarta).toBeFocused()
    await expect(cuarta).toHaveAttribute('aria-selected', 'true')
    // Acotado a la sección: el contacto también tiene pestañas (una por sede).
    await expect(page.locator('#servicios').getByRole('tabpanel')).toContainText('P4:')
  })
})

test.describe('Planes', () => {
  test('muestra «Consultar» y nunca un monto', async ({ page }) => {
    await page.goto('/')
    const tabla = page.getByRole('region', { name: 'Tabla comparativa de planes' })

    await expect(tabla.getByText('Consultar').first()).toBeVisible()
    await expect(tabla).not.toContainText(/S\/\s*\d/)
  })

  test('en el celular el selector cambia el plan visible', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')
    const selector = page.getByRole('group', { name: 'Elige un plan para ver lo que incluye' })

    await selector.getByRole('button', { name: 'SIGEMype II' }).click()

    await expect(page.getByRole('columnheader', { name: 'SIGEMype II' })).toBeVisible()
    await expect(page.getByRole('columnheader', { name: 'Emprende' })).toBeHidden()
  })
})
