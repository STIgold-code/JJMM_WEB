import { expect, test } from '@playwright/test'

import { infraccionesDeAccesibilidad } from './accesibilidad'

// Requiere la base con la carga inicial (`pnpm semilla`), que guarda la página del blog.
// Las publicaciones no forman parte de la semilla: estas pruebas no dependen de que existan.

test.describe('Blog', () => {
  test('el listado responde con su encabezado principal', async ({ page }) => {
    const respuesta = await page.goto('/blog')

    expect(respuesta?.status()).toBe(200)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  })

  test('el listado no tiene infracciones de accesibilidad WCAG 2.1 AA', async ({ page }) => {
    expect(await infraccionesDeAccesibilidad(page, '/blog')).toEqual([])
  })

  test('una página que no es número o no existe responde 404', async ({ page }) => {
    for (const ruta of ['/blog?pagina=0', '/blog?pagina=dos', '/blog?pagina=9999']) {
      const respuesta = await page.goto(ruta)
      expect(respuesta?.status(), ruta).toBe(404)
    }
  })

  test('una publicación, categoría o etiqueta desconocida responde 404', async ({ page }) => {
    for (const ruta of [
      '/blog/no-existe-esta-publicacion',
      '/blog/categoria/no-existe',
      '/blog/etiqueta/no-existe',
      '/blog/Con-Mayusculas',
    ]) {
      const respuesta = await page.goto(ruta)
      expect(respuesta?.status(), ruta).toBe(404)
    }
  })
})
