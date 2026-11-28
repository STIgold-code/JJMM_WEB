import { TIPOS_DE_DESTINO, validarDestino } from '@/compartido/dominio/destino-de-enlace'
import { validarTextoResaltado } from '@/modulos/portada/dominio/texto-resaltado'

import { type BotonGuardado, lineasDeLaLista, type PortadaGuardada } from './carrusel-de-portadas'
import {
  ERROR_DE_ENCUADRE,
  ERROR_DE_LISTA,
  ERROR_DESTINO_VACIO,
  ERROR_ETIQUETA_LARGA,
  ERROR_ETIQUETA_VACIA,
  ERROR_MENSAJE_LARGO,
  ERROR_SIN_IMAGEN,
  ERROR_SUBTITULO_LARGO,
  type ErroresDeBoton,
  type ErroresDePortada,
} from './errores-del-carrusel'
import type { BotonLeido, PortadaLeida } from './lectura-del-carrusel'
import { ERROR_TEXTO_LARGO } from './validacion-de-sede'

// Reglas de cada portada, las mismas del bloque: imagen obligatoria, título con la parte
// resaltada entre corchetes, encuadre de 0 a 100 y botones con su destino válido según su tipo.
export type BotonValidado = BotonGuardado

export interface PortadaValidada extends Omit<
  PortadaGuardada,
  'imagen' | 'imagenParaCelular' | 'sello' | 'botones'
> {
  imagen: number
  imagenParaCelular: number | null
  sello: number | null
  botones: BotonValidado[]
}

// Topes del panel contra entradas desmedidas; ninguna portada real se les acerca.
const LARGO_DEL_TITULO = 200
const LARGO_DEL_SUBTITULO = 500
const PUNTOS_DE_LA_LISTA = 8
const LARGO_DE_UN_PUNTO = 200
const LARGO_DE_LA_ETIQUETA = 60
const LARGO_DEL_MENSAJE = 500

const tipoDeDestino = (tipo: BotonLeido['tipo']) => TIPOS_DE_DESTINO.find((t) => t === tipo)

function errorDelDestino(boton: BotonLeido): string | undefined {
  const tipo = tipoDeDestino(boton.tipo)
  const destino = boton.destino.trim()
  if (!tipo) return undefined
  if (destino === '') return ERROR_DESTINO_VACIO
  return validarDestino(tipo, destino) ?? undefined
}

function erroresDelBoton(boton: BotonLeido): ErroresDeBoton {
  const etiqueta = boton.etiqueta.trim()
  const errores: ErroresDeBoton = {
    etiqueta: etiqueta === '' ? ERROR_ETIQUETA_VACIA : undefined,
    destino: errorDelDestino(boton),
    mensaje: boton.mensaje.trim().length > LARGO_DEL_MENSAJE ? ERROR_MENSAJE_LARGO : undefined,
  }
  if (etiqueta.length > LARGO_DE_LA_ETIQUETA) errores.etiqueta = ERROR_ETIQUETA_LARGA
  return errores
}

// WhatsApp guarda su mensaje (vacío: el de la configuración) y los destinos, su destino.
const botonValidado = (boton: BotonLeido): BotonValidado => ({
  etiqueta: boton.etiqueta.trim(),
  tipo: boton.tipo,
  mensaje: boton.tipo === 'whatsapp' ? boton.mensaje.trim() || null : null,
  destino: tipoDeDestino(boton.tipo) ? boton.destino.trim() : null,
  estilo: boton.estilo,
})

function errorDelTitulo(titulo: string): string | undefined {
  if (titulo.length > LARGO_DEL_TITULO) return ERROR_TEXTO_LARGO
  return validarTextoResaltado(titulo) ?? undefined
}

const encuadreValido = (encuadre: number | null) =>
  encuadre === null || (Number.isInteger(encuadre) && encuadre >= 0 && encuadre <= 100)

function erroresDeTextos(portada: PortadaLeida): ErroresDePortada {
  const lista = lineasDeLaLista(portada.lista)
  const listaLarga =
    lista.length > PUNTOS_DE_LA_LISTA || lista.some((p) => p.length > LARGO_DE_UN_PUNTO)
  return {
    titulo: errorDelTitulo(portada.titulo.trim()),
    subtitulo:
      portada.subtitulo.trim().length > LARGO_DEL_SUBTITULO ? ERROR_SUBTITULO_LARGO : undefined,
    lista: listaLarga ? ERROR_DE_LISTA : undefined,
  }
}

function erroresDeBotones(botones: readonly BotonLeido[]): Pick<ErroresDePortada, 'boton'> {
  const boton: Record<number, ErroresDeBoton> = {}
  botones.forEach((actual, indice) => {
    const errores = sinVacios(erroresDelBoton(actual))
    if (errores) boton[indice] = errores
  })
  return Object.keys(boton).length > 0 ? { boton } : {}
}

// Quita las claves sin error; `null` si no queda ninguna. El `as` es seguro: el resultado tiene
// un subconjunto de las claves de `T`, todas opcionales, con sus mismos valores.
function sinVacios<T extends object>(errores: T): T | null {
  const llenos = Object.entries(errores).filter(([, valor]) => valor !== undefined)
  return llenos.length > 0 ? (Object.fromEntries(llenos) as T) : null
}

export function erroresDePortada(portada: PortadaLeida): ErroresDePortada | null {
  return sinVacios({
    imagen: portada.imagen === null ? ERROR_SIN_IMAGEN : undefined,
    encuadre: encuadreValido(portada.encuadreEnCelular) ? undefined : ERROR_DE_ENCUADRE,
    ...erroresDeTextos(portada),
    ...erroresDeBotones(portada.botones),
  })
}

// Solo se llama sin errores: la imagen ya existe.
export function portadaValidada(portada: PortadaLeida, imagen: number): PortadaValidada {
  return {
    ...portada,
    imagen,
    titulo: portada.titulo.trim() || null,
    subtitulo: portada.subtitulo.trim() || null,
    lista: lineasDeLaLista(portada.lista),
    botones: portada.botones.map(botonValidado),
  }
}
