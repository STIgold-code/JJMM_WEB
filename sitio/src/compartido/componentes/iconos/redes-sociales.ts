import type { RedSocial } from '@/compartido/dominio/configuracion-del-sitio'

import type { NombreDeIcono } from './icono'

// Ícono y nombre accesible de cada red que permite el panel.
export const PRESENTACION_DE_REDES: Record<RedSocial, { icono: NombreDeIcono; nombre: string }> = {
  facebook: { icono: 'facebook', nombre: 'Facebook' },
  x: { icono: 'x', nombre: 'X (Twitter)' },
  youtube: { icono: 'youtube', nombre: 'YouTube' },
  instagram: { icono: 'instagram', nombre: 'Instagram' },
  tiktok: { icono: 'musica', nombre: 'TikTok' },
  linkedin: { icono: 'linkedin', nombre: 'LinkedIn' },
}
