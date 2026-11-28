import type { BloqueCarruselDePortadas, Medio, PaginaDeInicio } from '@/payload-types'

import type { CarruselGuardado, PortadaGuardada } from '../dominio/carrusel-de-portadas'
import type { SeccionLeida } from '../dominio/pagina-de-inicio'
import { type ImagenElegida, leerImagenElegida } from '../dominio/selector-de-imagen'
import type { CarruselValidado } from '../dominio/validacion-del-carrusel'
import type { BotonValidado, PortadaValidada } from '../dominio/validacion-de-portada'

// Traducción entre el bloque `carrusel-de-portadas` de Payload y el carrusel del panel.
export type SeccionDePayload = NonNullable<PaginaDeInicio['secciones']>[number]
type PortadaDePayload = NonNullable<BloqueCarruselDePortadas['portadas']>[number]

// Una imagen poblada (`depth: 1`) con dirección de medios válida; si no, `null`.
function aImagenElegida(valor: number | Medio | null | undefined): ImagenElegida | null {
  if (typeof valor !== 'object' || valor === null) return null
  return leerImagenElegida({
    id: valor.id,
    url: valor.url,
    alt: valor.alt,
    nombre: valor.filename ?? `imagen-${valor.id}`,
    ancho: valor.width,
    alto: valor.height,
  })
}

const aPortadaGuardada = (portada: PortadaDePayload): PortadaGuardada => ({
  imagen: aImagenElegida(portada.imagen),
  imagenEsDecorativa: portada.imagenEsDecorativa ?? true,
  imagenParaCelular: aImagenElegida(portada.imagenParaCelular),
  encuadreEnCelular: portada.encuadreEnCelular ?? null,
  disposicion: portada.disposicion,
  transicion: portada.transicion,
  titulo: portada.titulo ?? null,
  subtitulo: portada.subtitulo ?? null,
  sello: aImagenElegida(portada.sello),
  lista: (portada.lista ?? []).map((punto) => punto.texto),
  botones: (portada.acciones ?? []).map((accion) => ({
    etiqueta: accion.etiqueta,
    tipo: accion.tipo,
    mensaje: accion.mensaje ?? null,
    destino: accion.destino ?? null,
    estilo: accion.estilo,
  })),
})

export function aCarruselGuardado(
  bloque: BloqueCarruselDePortadas & { id: string },
  actualizadoEn: string,
): CarruselGuardado {
  return {
    seccion: bloque.id,
    actualizadoEn,
    segundosPorPortada: bloque.segundosPorPortada,
    portadas: (bloque.portadas ?? []).map(aPortadaGuardada),
  }
}

const aAccion = (boton: BotonValidado) => ({
  etiqueta: boton.etiqueta,
  tipo: boton.tipo,
  mensaje: boton.mensaje,
  destino: boton.destino,
  estilo: boton.estilo,
})

// Solo los campos del bloque; las filas se escriben nuevas (nada apunta a sus ids).
const aPortadaDePayload = (portada: PortadaValidada) => ({
  imagen: portada.imagen,
  imagenEsDecorativa: portada.imagenEsDecorativa,
  imagenParaCelular: portada.imagenParaCelular,
  encuadreEnCelular: portada.encuadreEnCelular,
  disposicion: portada.disposicion,
  transicion: portada.transicion,
  titulo: portada.titulo,
  subtitulo: portada.subtitulo,
  sello: portada.sello,
  lista: portada.lista.map((texto) => ({ texto })),
  acciones: portada.botones.map(aAccion),
})

// El bloque guardado con el carrusel del formulario. Conserva todo lo demás del bloque (su id,
// `blockName`, `blockType`). `null` si la sección no es un carrusel.
export function conCarrusel(
  seccion: SeccionDePayload,
  carrusel: CarruselValidado,
): SeccionDePayload | null {
  if (seccion.blockType !== 'carrusel-de-portadas') return null
  return {
    ...seccion,
    segundosPorPortada: carrusel.segundosPorPortada,
    portadas: carrusel.portadas.map(aPortadaDePayload),
  }
}

const titulo = (seccion: SeccionDePayload): string | null =>
  'titulo' in seccion && typeof seccion.titulo === 'string' ? seccion.titulo : null

export const aSeccionLeida = (seccion: SeccionDePayload): SeccionLeida => ({
  id: seccion.id ?? null,
  tipo: seccion.blockType,
  titulo: titulo(seccion),
  portadas: seccion.blockType === 'carrusel-de-portadas' ? (seccion.portadas?.length ?? 0) : null,
  segundos: seccion.blockType === 'carrusel-de-portadas' ? seccion.segundosPorPortada : null,
  cifras: seccion.blockType === 'quienes-somos' ? (seccion.cifras?.length ?? 0) : null,
})
