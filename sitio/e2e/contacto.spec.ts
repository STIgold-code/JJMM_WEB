import { expect, test } from '@playwright/test'

// Requiere la carga inicial (`pnpm semilla`), que el CI ejecuta antes de Playwright.
// El servidor descarta como robot un envío hecho antes de 3 s desde que se mostró el formulario.
const TIEMPO_DE_UNA_PERSONA_MS = 3_200

test.describe('Formulario de contacto', () => {
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
    await expect(formulario.getByLabel('Celular')).toHaveAttribute('aria-invalid', 'true')
  })

  test('rechaza un teléfono fijo', async ({ page }) => {
    await page.goto('/#contacto')
    const formulario = page.getByRole('form', { name: 'Escríbenos' })

    await formulario.getByLabel('Nombre y apellido').fill('Ana Torres')
    await formulario.getByLabel('Celular').fill('01 456 7890')
    await formulario.getByLabel('Cuéntanos tu caso').fill('Necesito declarar mi renta.')
    await formulario.getByRole('button', { name: /Enviar por WhatsApp/ }).click()

    await expect(formulario.getByLabel('Celular')).toHaveAccessibleDescription(
      'Escribe un celular de 9 dígitos que empiece con 9.',
    )
  })

  test('guarda el mensaje y abre WhatsApp con el texto armado', async ({ page, context }) => {
    // WhatsApp es externo: se responde con una página vacía para no salir a internet.
    await context.route('https://wa.me/**', (ruta) => ruta.fulfill({ body: 'WhatsApp' }))
    await page.goto('/#contacto')
    const formulario = page.getByRole('form', { name: 'Escríbenos' })

    await formulario.getByLabel('Nombre y apellido').fill('Ana Torres')
    await formulario.getByLabel('Celular').fill('987 654 321')
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
