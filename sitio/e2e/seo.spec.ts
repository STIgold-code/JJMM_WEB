import { expect, test } from '@playwright/test'

// SEO (T11): robots, sitemap, canonical absoluto y redirecciones de las URL anteriores.
// Requiere la base con la carga inicial (`pnpm semilla`); no depende de que haya publicaciones.

test.describe('SEO', () => {
  test('robots.txt deja fuera el panel y enlaza el sitemap', async ({ request }) => {
    const respuesta = await request.get('/robots.txt')

    expect(respuesta.status()).toBe(200)
    const texto = await respuesta.text()
    expect(texto).toContain('Disallow: /admin')
    expect(texto).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/)
  })

  test('el sitio tiene favicon y los archivos de ícono responden', async ({ page, request }) => {
    await page.goto('/')

    const icono = page.locator('link[rel="icon"]').first()
    await expect(icono).toHaveAttribute('href', /.+/)
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveCount(1)

    const href = (await icono.getAttribute('href')) ?? ''
    for (const ruta of [href, '/favicon.ico']) {
      const respuesta = await request.get(ruta)
      expect(respuesta.status(), ruta).toBe(200)
      expect(respuesta.headers()['content-type'], ruta).toMatch(/^image\//)
    }
  })

  test('sitemap.xml lista el inicio, la guía y el blog con URL absolutas', async ({ request }) => {
    const respuesta = await request.get('/sitemap.xml')

    expect(respuesta.status()).toBe(200)
    const texto = await respuesta.text()
    for (const ruta of ['/', '/guia', '/blog']) {
      expect(texto).toMatch(new RegExp(`<loc>https?://[^<]+${ruta.replace('/', '\\/')}</loc>`))
    }
  })

  test('el inicio tiene canonical absoluto y datos estructurados del estudio', async ({ page }) => {
    await page.goto('/')

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /^https?:\/\//)
    const jsonLd = await page.locator('script[type="application/ld+json"]').first().textContent()
    expect(JSON.parse(jsonLd ?? '{}')).toMatchObject({ '@type': 'AccountingService' })
  })

  test('las URL del blog anterior redirigen con 301', async ({ request }) => {
    const casos = [
      ['/blog/posts/nuevos-requisitos-cpe-2021', '/blog/nuevos-requisitos-cpe-2021'],
      ['/blog/category/contabilidad', '/blog/categoria/contabilidad'],
      ['/blog/tag/cpe-2021', '/blog/etiqueta/cpe-2021'],
      ['/blog?page=2', '/blog?pagina=2'],
      ['/blog/category/contabilidad?page=2', '/blog/categoria/contabilidad?pagina=2'],
      ['/guia_clientes.html', '/guia'],
    ] as const
    for (const [origen, destino] of casos) {
      const respuesta = await request.get(origen, { maxRedirects: 0 })
      expect(respuesta.status(), origen).toBe(301)
      // Next conserva los parámetros originales (?page=…): se compara ruta y `pagina`.
      const esperada = new URL(destino, 'http://sitio')
      const recibida = new URL(respuesta.headers()['location'] ?? '', 'http://sitio')
      expect(recibida.pathname, origen).toBe(esperada.pathname)
      expect(recibida.searchParams.get('pagina'), origen).toBe(esperada.searchParams.get('pagina'))
    }
  })
})
