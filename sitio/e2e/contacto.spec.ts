import { expect, test } from '@playwright/test'

// Requiere la carga inicial (`pnpm semilla`), que el CI ejecuta antes de Playwright.
// El servidor descarta como robot un envío hecho antes de 3 s desde que se mostró el formulario.
const TIEMPO_DE_UNA_PERSONA_MS = 3_200

test.describe('Formulario de contacto', () => {
  test('pide solo nombre, servicio y caso', async ({ page }) => {
    await page.goto('/#contacto')
    const formulario = page.getByRole('form', { name: 'Escríbenos' })

    await expect(formulario.getByRole('textbox')).toHaveCount(2)
    await expect(formulario.getByLabel('¿Qué necesitas?')).toBeVisible()
    await expect(formulario.getByLabel('Celular')).toHaveCount(0)
    await expect(formulario.getByLabel('Correo')).toHaveCount(0)
  })

  test('marca los errores en línea y enfoca el primer campo inválido', async ({ page }) => {
    await page.goto('/#contacto')
    const formulario = page.getByRole('form', { name: 'Escríbenos' })

    await formulario.getByRole('button', { name: /Enviar por WhatsApp/ }).click()

    const nombre = formulario.getByLabel('Nombre y apellido')
    await expect(nombre).toBeFocused()
    await expect(nombre).toHaveAttribute('aria-invalid', 'true')
    await expect(nombre).toHaveAccessibleDescription(
      'Escribe tu nombre para saber cómo dirigirnos a ti.',
    )
    await expect(formulario.getByLabel('Cuéntanos tu caso')).toHaveAccessibleDescription(
      'Cuéntanos en una línea qué necesitas.',
    )
  })

  test('guarda el mensaje y abre WhatsApp con el texto armado', async ({ page, context }) => {
    // WhatsApp es externo: se responde con una página vacía para no salir a internet.
    await context.route('https://wa.me/**', (ruta) => ruta.fulfill({ body: 'WhatsApp' }))
    await page.goto('/#contacto')
    const formulario = page.getByRole('form', { name: 'Escríbenos' })

    await formulario.getByLabel('Nombre y apellido').fill('Ana Torres')
    await formulario.getByLabel('¿Qué necesitas?').selectOption('Asesoría tributaria')
    await formulario.getByLabel('Cuéntanos tu caso').fill('Necesito declarar mi renta.')
    await page.waitForTimeout(TIEMPO_DE_UNA_PERSONA_MS)
    const pestana = context.waitForEvent('page')
    await formulario.getByRole('button', { name: /Enviar por WhatsApp/ }).click()

    const whatsapp = await pestana
    await whatsapp.waitForURL(/^https:\/\/wa\.me\//)
    const texto = new URL(whatsapp.url()).searchParams.get('text')
    expect(whatsapp.url()).toMatch(/^https:\/\/wa\.me\/51\d{9}\?/)
    expect(texto).toBe(
      'Hola, soy Ana Torres. Necesito: Asesoría tributaria. Necesito declarar mi renta.',
    )
    await expect(formulario.getByRole('status')).toContainText('Recibimos tus datos.')
  })
})

test.describe('Sedes de contacto', () => {
  test('una pestaña por sede, operable con las flechas', async ({ page }) => {
    await page.goto('/#contacto')
    const pestanas = page.getByRole('tablist', { name: 'Sedes' })
    const primera = pestanas.getByRole('tab', { name: 'San Martín de Porres' })
    const segunda = pestanas.getByRole('tab', { name: 'San Isidro' })

    await expect(primera).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel', { name: 'San Martín de Porres' })).toBeVisible()
    await expect(page.getByRole('tabpanel', { name: 'San Isidro' })).toBeHidden()

    await primera.focus()
    await page.keyboard.press('ArrowRight')

    await expect(segunda).toBeFocused()
    await expect(segunda).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByRole('tabpanel', { name: 'San Isidro' })).toContainText(
      'Calle Gorriones 151, San Isidro, Lima',
    )
  })

  test('el mapa no carga Google Maps hasta pulsar «Ver mapa»', async ({ page }) => {
    const pedidosAGoogle: string[] = []
    page.on('request', (pedido) => {
      if (pedido.url().startsWith('https://www.google.com/maps')) pedidosAGoogle.push(pedido.url())
    })
    await page.route('https://www.google.com/maps**', (ruta) => ruta.fulfill({ body: 'Mapa' }))
    await page.goto('/#contacto')
    const panel = page.getByRole('tabpanel', { name: 'San Martín de Porres' })

    await expect(panel.getByRole('link', { name: /Cómo llegar/ })).toHaveAttribute(
      'href',
      /^https:\/\/www\.google\.com\/maps\/search\//,
    )
    expect(pedidosAGoogle).toEqual([])

    await panel.getByRole('button', { name: /Ver mapa/ }).click()

    const mapa = panel.locator('iframe[title="Mapa de la Sede San Martín de Porres"]')
    await expect(mapa).toBeFocused()
    await expect(mapa).toHaveAttribute('src', /^https:\/\/www\.google\.com\/maps\/embed\?/)
  })
})
