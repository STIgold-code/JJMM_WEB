// Grupos del menú lateral del panel. Payload los muestra en el orden en que aparecen por
// primera vez en `contenido.ts` (primero las colecciones y luego las globales), así que ese
// orden debe coincidir con `ORDEN_DE_GRUPOS`; `configuracion-del-panel.test.ts` lo exige.
export const GRUPOS_DEL_PANEL = {
  inicio: 'Inicio',
  guia: 'Guía de clientes',
  blog: 'Blog',
  contacto: 'Contacto',
  sitio: 'Sitio',
  administracion: 'Administración',
} as const

export type GrupoDelPanel = (typeof GRUPOS_DEL_PANEL)[keyof typeof GRUPOS_DEL_PANEL]

export const ORDEN_DE_GRUPOS: readonly GrupoDelPanel[] = Object.values(GRUPOS_DEL_PANEL)
