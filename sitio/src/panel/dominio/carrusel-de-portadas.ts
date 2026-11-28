import type { EstiloDeAccion, TipoDeAccion } from '@/modulos/portada/dominio/accion-de-portada'
import type { Disposicion, Transicion } from '@/modulos/portada/dominio/portada'

import type { ImagenElegida } from './selector-de-imagen'

// Carrusel de portadas (bloque `carrusel-de-portadas` de la página de inicio) tal como lo edita el
// panel. Los campos son los del bloque; nada más.
export const DISPOSICIONES: readonly Disposicion[] = [
  'texto-derecha',
  'texto-izquierda',
  'imagen-completa',
]
export const TRANSICIONES: readonly Transicion[] = ['fundido', 'izquierda', 'bajar', 'recorte']
export const TIPOS_DE_BOTON: readonly TipoDeAccion[] = [
  'whatsapp',
  'llamada',
  'seccion',
  'interna',
  'externa',
]
export const ESTILOS_DE_BOTON: readonly EstiloDeAccion[] = ['principal', 'secundario']

// Límites del bloque (`campoAcciones(2)`, `segundosPorPortada` de 3 a 30) y topes del panel.
export const MAXIMO_DE_BOTONES = 2
export const SEGUNDOS_MINIMOS = 3
export const SEGUNDOS_MAXIMOS = 30
export const MAXIMO_DE_PORTADAS = 12

export interface BotonGuardado {
  etiqueta: string
  tipo: TipoDeAccion
  mensaje: string | null
  destino: string | null
  estilo: EstiloDeAccion
}

export interface PortadaGuardada {
  imagen: ImagenElegida | null
  imagenEsDecorativa: boolean
  imagenParaCelular: ImagenElegida | null
  encuadreEnCelular: number | null
  disposicion: Disposicion
  transicion: Transicion
  titulo: string | null
  subtitulo: string | null
  sello: ImagenElegida | null
  lista: string[]
  botones: BotonGuardado[]
}

// `seccion`: id del bloque en la página; `actualizadoEn`: la versión de la página que se cargó.
export interface CarruselGuardado {
  seccion: string
  actualizadoEn: string
  segundosPorPortada: number
  portadas: PortadaGuardada[]
}

// Formulario, tal como se escribe. Cada fila lleva una `clave` estable para React; no se guarda.
export interface BotonDelFormulario extends Omit<BotonGuardado, 'mensaje' | 'destino'> {
  clave: number
  mensaje: string
  destino: string
}

export interface PortadaDelFormulario extends Omit<
  PortadaGuardada,
  'titulo' | 'subtitulo' | 'lista' | 'botones'
> {
  clave: number
  titulo: string
  subtitulo: string
  // Un punto por línea.
  lista: string
  botones: BotonDelFormulario[]
}

export interface FormularioDelCarrusel {
  seccion: string
  actualizadoEn: string
  segundosPorPortada: string
  portadas: PortadaDelFormulario[]
}

export const botonNuevo = (clave: number): BotonDelFormulario => ({
  clave,
  etiqueta: '',
  tipo: 'whatsapp',
  mensaje: '',
  destino: '',
  estilo: 'principal',
})

// Valores iniciales del bloque: decorativa, texto a la izquierda y fundido.
export const portadaNueva = (clave: number): PortadaDelFormulario => ({
  clave,
  imagen: null,
  imagenEsDecorativa: true,
  imagenParaCelular: null,
  encuadreEnCelular: null,
  disposicion: 'texto-izquierda',
  transicion: 'fundido',
  titulo: '',
  subtitulo: '',
  sello: null,
  lista: '',
  botones: [],
})

const aFormulario = (portada: PortadaGuardada, indice: number): PortadaDelFormulario => ({
  ...portada,
  clave: indice + 1,
  titulo: portada.titulo ?? '',
  subtitulo: portada.subtitulo ?? '',
  lista: portada.lista.join('\n'),
  botones: portada.botones.map((boton, posicion) => ({
    ...boton,
    clave: posicion + 1,
    mensaje: boton.mensaje ?? '',
    destino: boton.destino ?? '',
  })),
})

export function formularioDelCarrusel(guardado: CarruselGuardado): FormularioDelCarrusel {
  return {
    seccion: guardado.seccion,
    actualizadoEn: guardado.actualizadoEn,
    segundosPorPortada: String(guardado.segundosPorPortada),
    portadas: guardado.portadas.map(aFormulario),
  }
}

// Líneas con texto de la lista, recortadas.
export const lineasDeLaLista = (lista: string): string[] =>
  lista
    .split('\n')
    .map((linea) => linea.trim())
    .filter(Boolean)

const claveDeBoton = (b: BotonDelFormulario) => [
  b.etiqueta.trim(),
  b.tipo,
  b.mensaje.trim(),
  b.destino.trim(),
  b.estilo,
]

const claveDePortada = (p: PortadaDelFormulario) => [
  [p.imagen?.id, p.imagenParaCelular?.id, p.sello?.id, p.encuadreEnCelular],
  [p.imagenEsDecorativa, p.disposicion, p.transicion, p.titulo.trim(), p.subtitulo.trim()],
  lineasDeLaLista(p.lista),
  p.botones.map(claveDeBoton),
]

// «Guardar cambios» se activa solo si lo que se guardaría difiere de lo guardado.
export function hayCambiosEnElCarrusel(
  original: FormularioDelCarrusel,
  actual: FormularioDelCarrusel,
): boolean {
  const clave = (f: FormularioDelCarrusel) =>
    JSON.stringify([f.segundosPorPortada.trim(), f.portadas.map(claveDePortada)])
  return clave(original) !== clave(actual)
}
