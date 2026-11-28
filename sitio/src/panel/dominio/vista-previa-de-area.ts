import { type AreaDelPanel, estaEnLaRueda } from './areas-de-servicio'
import type { FormularioDeArea } from './formulario-de-area'

// Vista previa de «Nuestros servicios» mientras se edita un área: la rueda con los gajos guardados
// de las demás y el del área con lo que se escribe (resaltado), las pestañas en el orden del sitio
// y la pestaña abierta. Nunca lanza: un gajo a medio escribir no se dibuja.
export interface PestanaDeVistaPrevia {
  codigo: string
  corto: string
  actual: boolean
}

export interface GajoDeVistaPrevia {
  codigo: string
  puntos: string
  actual: boolean
}

export interface VistaPreviaDeArea {
  pestanas: PestanaDeVistaPrevia[]
  gajos: GajoDeVistaPrevia[]
  nombre: string
  descripcion: string
  puntos: string[]
  mensaje: string
  // El área no tiene gajo: solo aparece en las pestañas.
  sinGajo: boolean
}

interface Datos {
  areas: readonly AreaDelPanel[]
  idDelArea: number
  formulario: FormularioDeArea
  // El mensaje de «Datos del estudio» que se usa si el área no tiene uno propio.
  mensajePorDefecto: string
}

function gajoDe(area: AreaDelPanel, datos: Datos): GajoDeVistaPrevia | null {
  const actual = area.id === datos.idDelArea
  const puntos = (actual ? datos.formulario.poligono : (area.poligono ?? '')).trim()
  return estaEnLaRueda(puntos) ? { codigo: area.codigo, puntos, actual } : null
}

export function vistaPreviaDeArea(datos: Datos): VistaPreviaDeArea {
  const { areas, idDelArea, formulario } = datos
  return {
    pestanas: areas.map((area) => {
      const actual = area.id === idDelArea
      const corto = actual ? formulario.nombreCorto.trim() || '…' : area.nombreCorto
      return { codigo: area.codigo, corto, actual }
    }),
    gajos: areas.flatMap((area) => gajoDe(area, datos) ?? []),
    nombre: formulario.nombre.trim() || 'Sin nombre',
    descripcion: formulario.descripcion.trim(),
    puntos: formulario.puntos.map((p) => p.texto.trim()).filter(Boolean),
    mensaje: formulario.mensaje.trim() || datos.mensajePorDefecto,
    sinGajo: formulario.poligono.trim() === '',
  }
}
