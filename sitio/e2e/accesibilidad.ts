import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'

const NORMAS_WCAG_21_AA = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

// Analiza la página con axe en su estado final. Con movimiento reducido las animaciones de
// entrada no corren: así el contraste se mide sobre lo que lee el visitante y no sobre un
// cuadro intermedio de un fundido.
export async function infraccionesDeAccesibilidad(page: Page, ruta: string) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(ruta)
  const resultado = await new AxeBuilder({ page }).withTags(NORMAS_WCAG_21_AA).analyze()
  return resultado.violations
}
