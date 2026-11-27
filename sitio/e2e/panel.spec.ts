import { expect, test } from '@playwright/test'

// En CI la base tiene la carga inicial pero ninguna cuenta (la semilla no crea usuarios sin
// SEMILLA_ADMIN_*), así que /admin lleva a la creación del primer usuario. Si ya existiera una
// cuenta, llevaría al ingreso: la prueba acepta las dos pantallas.
test.describe('Panel administrativo', () => {
  test('muestra el logotipo del estudio, en español y con el título de la marca', async ({
    page,
  }) => {
    await page.goto('/admin')

    await expect(page.getByRole('img', { name: /Estudio Contable JJMM/ })).toBeVisible()
    await expect(
      page.getByRole('button', { name: /^(Crear|Iniciar sesión)/ }).first(),
    ).toBeVisible()
    await expect(page).toHaveTitle(/Panel JJMM/)
  })

  test('el logotipo es un archivo estático, no depende de la base de datos', async ({
    request,
  }) => {
    const respuesta = await request.get('/panel/logo-jjmm.png')

    expect(respuesta.status()).toBe(200)
    expect(respuesta.headers()['content-type']).toBe('image/png')
  })
})
