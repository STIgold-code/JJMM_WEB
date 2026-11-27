import { AREAS_DE_SERVICIO } from './areas-de-servicio'
import { AVISOS } from './avisos'
import { MEDIOS } from './medios'
import { CLIENTES, VALORES } from './nosotros'
import { PAGINA_DE_INICIO } from './pagina-de-inicio'
import { CARACTERISTICAS, PLANES } from './planes'
import { GUIA_DE_CLIENTES, PAGINA_DEL_BLOG } from './paginas'
import { CONFIGURACION, NAVEGACION, SEDES } from './sitio'
import type { DatosDeSemilla } from './tipos'
import { VENCIMIENTOS } from './vencimientos'

// Contenido real del sitio actual (inicio v4, guía de clientes y PRODUCT.md). Nada se
// inventa: lo que falta confirmar está marcado en cada archivo y en L7 del plan.
export const SEMILLA: DatosDeSemilla = {
  medios: MEDIOS,
  configuracion: CONFIGURACION,
  navegacion: NAVEGACION,
  sedes: SEDES,
  paginaDeInicio: PAGINA_DE_INICIO,
  areas: AREAS_DE_SERVICIO,
  planes: PLANES,
  caracteristicas: CARACTERISTICAS,
  valores: VALORES,
  clientes: CLIENTES,
  avisos: AVISOS,
  vencimientos: VENCIMIENTOS,
  guia: GUIA_DE_CLIENTES,
  blog: PAGINA_DEL_BLOG,
}
