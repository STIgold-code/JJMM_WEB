import { resolverUrlDelSitio } from '../dominio/url-del-sitio'

// URL pública del sitio leída del entorno. `next.config.ts` ya la valida al compilar y al
// arrancar en producción; aquí se lee con el nombre literal para que Next la incruste.
export const urlDelSitio = (): URL =>
  resolverUrlDelSitio(process.env.NEXT_PUBLIC_SITE_URL, process.env.NODE_ENV === 'production')
