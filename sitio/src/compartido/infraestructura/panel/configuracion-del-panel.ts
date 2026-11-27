import { es } from '@payloadcms/translations/languages/es'
import type { Config } from 'payload'

// Apariencia del panel: idioma, marca e inicio. `payload.config.ts` lo une con el resto de la
// configuración. Las rutas de los componentes parten de `src/` (`importMap.baseDir`) y se
// registran en `app/(payload)/admin/importMap.js` con `pnpm generate:importmap`.
const COMPONENTES = {
  logo: '/compartido/componentes/panel/logo-del-panel#LogoDelPanel',
  icono: '/compartido/componentes/panel/icono-del-panel#IconoDelPanel',
  inicio: '/compartido/infraestructura/panel/inicio-del-panel#InicioDelPanel',
} as const

// Todo el panel en español para todos, sin selector de idioma.
export const I18N_DEL_PANEL: NonNullable<Config['i18n']> = {
  supportedLanguages: { es },
  fallbackLanguage: 'es',
}

export const ADMIN_DEL_PANEL: NonNullable<Config['admin']> = {
  // Formato de date-fns con el idioma del panel: «27 de noviembre de 2026, 15:40».
  dateFormat: "d 'de' MMMM 'de' yyyy, HH:mm",
  components: {
    graphics: { Logo: COMPONENTES.logo, Icon: COMPONENTES.icono },
    beforeDashboard: [COMPONENTES.inicio],
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
