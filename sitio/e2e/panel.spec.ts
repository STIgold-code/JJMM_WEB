import { expect, type Page, test } from '@playwright/test'

import { infraccionesDeAccesibilidad } from './accesibilidad'

// En CI la base tiene la carga inicial pero ninguna cuenta (la semilla no crea usuarios sin
// SEMILLA_ADMIN_*), así que /admin lleva a la creación del primer usuario. Si ya existiera una
// cuenta, llevaría al ingreso: las pruebas aceptan las dos pantallas.
const TITULO_DE_ACCESO = /^(Te damos la bienvenida|Ingresa al panel)$/

function campoDeContrasena(page: Page) {
  const campo = page.locator('#field-password')
  const contenedor = page.locator('.field-type.password', { has: campo })
  return { campo, boton: contenedor.getByRole('button') }
}

test.describe('Panel administrativo: pantalla de acceso', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('heading', { level: 1, name: TITULO_DE_ACCESO })).toBeVisible()
  })

  test('muestra el panel de marca del estudio, en español y con el título de la marca', async ({
    page,
  }) => {
    const marca = page.getByRole('complementary', { name: 'Estudio Contable JJMM' })

    await expect(marca).toBeVisible()
    await expect(marca).toContainText('Estudio Contable JJMM')
    await expect(marca).toContainText('Mariñas & Asociados')
    await expect(
      page.getByRole('button', { name: /^(Crear|Iniciar sesión)/ }).first(),
    ).toBeVisible()
    await expect(page).toHaveTitle(/Panel JJMM/)
  })

  test('el botón «ojo» muestra y oculta la contraseña', async ({ page }) => {
    const { campo, boton } = campoDeContrasena(page)
    await campo.fill('una-clave-de-prueba')

    await expect(campo).toHaveAttribute('type', 'password')
    await expect(boton).toHaveAccessibleName('Mostrar contraseña')
    await expect(boton).toHaveAttribute('aria-pressed', 'false')

    await boton.click()
    await expect(campo).toHaveAttribute('type', 'text')
    await expect(boton).toHaveAccessibleName('Ocultar contraseña')
    await expect(boton).toHaveAttribute('aria-pressed', 'true')
    await expect(campo).toHaveValue('una-clave-de-prueba')

    await boton.click()
    await expect(campo).toHaveAttribute('type', 'password')
    await expect(boton).toHaveAttribute('aria-pressed', 'false')
  })

  test('el botón «ojo» funciona con el teclado y no envía el formulario', async ({ page }) => {
    const { campo, boton } = campoDeContrasena(page)
    const direccion = page.url()

    await boton.focus()
    await page.keyboard.press('Enter')
    await expect(campo).toHaveAttribute('type', 'text')
    await page.keyboard.press('Space')
    await expect(campo).toHaveAttribute('type', 'password')
    expect(page.url()).toBe(direccion)
  })
})

const ARCHIVOS_ESTATICOS = [
  ['/panel/logo-jjmm.png', 'image/png'],
  ['/panel/marca-jjmm.png', 'image/png'],
  ['/panel/acceso-jjmm.webp', 'image/webp'],
] as const

test.describe('Panel administrativo: archivos estáticos', () => {
  for (const [ruta, tipo] of ARCHIVOS_ESTATICOS) {
    test(`${ruta} no depende de la base de datos`, async ({ request }) => {
      const respuesta = await request.get(ruta)

      expect(respuesta.status()).toBe(200)
      expect(respuesta.headers()['content-type']).toBe(tipo)
    })
  }
})

// Panel propio (/panel). En CI no hay cuentas, así que se prueba lo que se ve sin sesión.
const RUTA_DE_INGRESO = /\/panel\/ingreso$/

test.describe('Panel propio: sin sesión', () => {
  test('/panel sin sesión lleva al ingreso', async ({ page }) => {
    await page.goto('/panel')
    await expect(page).toHaveURL(RUTA_DE_INGRESO)
    await expect(page.getByRole('heading', { level: 1, name: 'Ingresa al panel' })).toBeVisible()
  })

  test('/panel/mensajes sin sesión lleva al ingreso, aunque pida un mensaje', async ({ page }) => {
    await page.goto('/panel/mensajes?filtro=todos&mensaje=1')
    await expect(page).toHaveURL(RUTA_DE_INGRESO)
    await expect(page.getByRole('heading', { level: 1, name: 'Ingresa al panel' })).toBeVisible()
  })

  test('el ingreso no tiene infracciones de accesibilidad (WCAG 2.1 AA)', async ({ page }) => {
    expect(await infraccionesDeAccesibilidad(page, '/panel/ingreso')).toEqual([])
  })

  test('con credenciales erróneas muestra el aviso y sigue en el ingreso', async ({ page }) => {
    await page.goto('/panel/ingreso')
    await page.getByLabel('Correo').fill('nadie@ejemplo.pe')
    await page.getByLabel('Contraseña', { exact: true }).fill('clave-equivocada')
    await page.getByRole('button', { name: 'Ingresar' }).click()

    // Next agrega su propio `role="alert"` (el anunciador de rutas): se filtra por el texto.
    await expect(
      page.getByRole('alert').filter({ hasText: 'El correo o la contraseña no son correctos' }),
    ).toBeVisible()
    await expect(page).toHaveURL(RUTA_DE_INGRESO)
    await expect(page.getByLabel('Correo')).toHaveValue('nadie@ejemplo.pe')
  })

  test('el botón «ojo» muestra y oculta la contraseña', async ({ page }) => {
    await page.goto('/panel/ingreso')
    const campo = page.getByLabel('Contraseña', { exact: true })

    await page.getByRole('button', { name: 'Mostrar la contraseña' }).click()
    await expect(campo).toHaveAttribute('type', 'text')
    const ocultar = page.getByRole('button', { name: 'Ocultar la contraseña' })
    await expect(ocultar).toHaveAttribute('aria-pressed', 'true')

    await ocultar.click()
    await expect(campo).toHaveAttribute('type', 'password')
  })
})
