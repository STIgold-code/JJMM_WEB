import { esListaDePuntosValida } from '@/modulos/servicios/dominio/area-de-servicio'

import { RUTA_DEL_INICIO } from './rutas-del-panel'

// Áreas de servicio en el panel: las nueve áreas de la rueda SIGE Mype (P1 a P9) que muestra
// «Nuestros servicios» del inicio. El código identifica el gajo de la rueda: es fijo, no se edita,
// y las áreas no se crean ni se borran desde el panel.
export const RUTA_DE_AREAS = `${RUTA_DEL_INICIO}/areas`
export const AREAS_DE_LA_RUEDA = 9

export function rutaDelArea(id: number): string {
  return `${RUTA_DE_AREAS}/${id}`
}

export interface AreaDelPanel {
  id: number
  codigo: string
  nombre: string
  nombreCorto: string
  descripcion: string
  puntos: string[]
  mensajeDeConsulta: string | null
  poligono: string | null
  orden: number
}

// Con un gajo válido el área se puede pulsar en la rueda; si no, solo está en las pestañas (como
// lo dibuja el sitio).
export function estaEnLaRueda(poligono: string | null): boolean {
  return poligono !== null && esListaDePuntosValida(poligono.trim())
}

const plural = (cantidad: number, uno: string, varios: string) =>
  `${cantidad} ${cantidad === 1 ? uno : varios}`

// Dato secundario de la fila: «Pestaña «Calidad» · 4 puntos en «Qué incluye»».
export function secundarioDeArea(area: Pick<AreaDelPanel, 'nombreCorto' | 'puntos'>): string {
  const puntos = plural(area.puntos.length, 'punto', 'puntos')
  return `Pestaña «${area.nombreCorto}» · ${puntos} en «Qué incluye»`
}

// Por qué «Nueva área» está deshabilitado, como lo explica la maqueta.
export function razonSinNuevaArea(cantidad: number): string {
  if (cantidad >= AREAS_DE_LA_RUEDA)
    return `${cantidad} áreas: ya están todas las de la rueda (P1 a P9), por eso no se puede crear otra.`
  return 'Las áreas son los gajos fijos de la rueda (P1 a P9): no se crean desde el panel.'
}
