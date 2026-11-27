import { es } from '@payloadcms/translations/languages/es'
import type { Config } from 'payload'

import { TRADUCCIONES_DEL_PANEL } from './traducciones-del-panel'

// Apariencia del panel: idioma, marca, menú, ingreso e inicio. `payload.config.ts` lo une con
// el resto de la configuración. Las rutas de los componentes parten de `src/`
// (`importMap.baseDir`) y se registran en `app/(payload)/admin/importMap.js` con
// `pnpm generate:importmap`. Los que leen datos o usan `@payloadcms/ui` viven en
// `infraestructura/panel/`; los de solo presentación, en `componentes/panel/`.
const PANEL = '/compartido/infraestructura/panel'
const VISTA = '/compartido/componentes/panel'

const COMPONENTES = {
  logo: `${VISTA}/logo-del-panel#LogoDelPanel`,
  icono: `${VISTA}/icono-del-panel#IconoDelPanel`,
  inicio: `${PANEL}/inicio-del-panel#InicioDelPanel`,
  proveedor: `${PANEL}/proveedor-del-panel#ProveedorDelPanel`,
  cabeceraDelMenu: `${PANEL}/menu-lateral#CabeceraDelMenuLateral`,
  pieDelMenu: `${VISTA}/enlace-al-sitio#EnlaceAlSitio`,
  encabezadoDeIngreso: `${VISTA}/encabezado-de-ingreso#EncabezadoDeIngreso`,
} as const

// Todo el panel en español para todos, sin selector de idioma.
export const I18N_DEL_PANEL: NonNullable<Config['i18n']> = {
  supportedLanguages: { es },
  fallbackLanguage: 'es',
  translations: { es: TRADUCCIONES_DEL_PANEL },
}

export const ADMIN_DEL_PANEL: NonNullable<Config['admin']> = {
  // Formato de date-fns con el idioma del panel: «27 de noviembre de 2026, 15:40».
  dateFormat: "d 'de' MMMM 'de' yyyy, HH:mm",
  components: {
    graphics: { Logo: COMPONENTES.logo, Icon: COMPONENTES.icono },
    // El proveedor envuelve todo el panel: dibuja el panel de marca en las pantallas de acceso
    // y agrega el botón para ver la contraseña.
    providers: [COMPONENTES.proveedor],
    beforeNavLinks: [COMPONENTES.cabeceraDelMenu],
    afterNavLinks: [COMPONENTES.pieDelMenu],
    beforeLogin: [COMPONENTES.encabezadoDeIngreso],
    views: { dashboard: { Component: COMPONENTES.inicio } },
  },
  meta: {
    titleSuffix: ' · Panel JJMM',
    description: 'Panel para editar el sitio web del Estudio Contable JJMM.',
    // Sin imagen de vista previa generada: el panel no se comparte en redes.
    defaultOGImageType: 'off',
    icons: [
      { rel: 'icon', url: '/favicon.ico' },
      { rel: 'icon', type: 'image/png', url: '/panel/sello-jjmm.png' },
      { rel: 'apple-touch-icon', type: 'image/png', url: '/panel/sello-jjmm.png' },
    ],
  },
}
