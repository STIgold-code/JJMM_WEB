import { ERROR_DE_FORMULARIO, esObjeto } from './formularios'
import {
  LARGO_MAXIMO_CORTO,
  leerTexto,
  soloConError,
  textoDemasiadoLargo,
} from './guia-de-clientes'
import { ERROR_DE_CORREO, esCorreoValido } from './respuesta-al-mensaje'

// Validación en el servidor del formulario de un aviso (`unknown`). Aplica las reglas de la
// colección `avisos-para-clientes` (título y «Cuándo aplica» obligatorios, correo como el `email`
// de Payload) más topes contra entradas desmedidas. Los documentos llegan uno por línea.
export interface AvisoValidado {
  titulo: string
  cuandoAplica: string
  documentos: string[]
  correo: string | null
}

export interface ErroresDeAviso {
  general?: string
  titulo?: string
  cuandoAplica?: string
  documentos?: string
  correo?: string
}

export type ValidacionDeAviso =
  { valido: true; datos: AvisoValidado } | { valido: false; errores: ErroresDeAviso }

const LARGO_MAXIMO_DE_CUANDO_APLICA = 2000
const MAXIMO_DE_DOCUMENTOS = 50

interface Leido {
  titulo: string
  cuandoAplica: string
  documentos: string[]
  correo: string
}

function leerFormulario(entrada: unknown): Leido | null {
  if (!esObjeto(entrada)) return null
  const [titulo, cuandoAplica, documentos, correo] = [
    entrada.titulo,
    entrada.cuandoAplica,
    entrada.documentos,
    entrada.correo,
  ].map(leerTexto)
  if (titulo == null || cuandoAplica == null || documentos == null || correo == null) return null
  const lineas = documentos
    .split('\n')
    .map((linea) => linea.trim())
    .filter(Boolean)
  return { titulo, cuandoAplica, documentos: lineas, correo }
}

function errorDeTexto(texto: string, vacio: string, maximo: number): string | null {
  if (texto === '') return vacio
  return texto.length > maximo ? textoDemasiadoLargo(maximo) : null
}

function errorDeDocumentos(documentos: readonly string[]): string | null {
  if (documentos.length > MAXIMO_DE_DOCUMENTOS)
    return `Un aviso puede tener hasta ${MAXIMO_DE_DOCUMENTOS} documentos.`
  if (documentos.some((documento) => documento.length > LARGO_MAXIMO_CORTO))
    return `Cada documento puede tener hasta ${LARGO_MAXIMO_CORTO} caracteres.`
  return null
}

function erroresDe(leido: Leido): ErroresDeAviso {
  return soloConError({
    titulo: errorDeTexto(leido.titulo, 'Escribe el título del aviso.', LARGO_MAXIMO_CORTO),
    cuandoAplica: errorDeTexto(
      leido.cuandoAplica,
      'Escribe cuándo aplica el aviso.',
      LARGO_MAXIMO_DE_CUANDO_APLICA,
    ),
    documentos: errorDeDocumentos(leido.documentos),
    correo: leido.correo !== '' && !esCorreoValido(leido.correo) ? ERROR_DE_CORREO : null,
  })
}

export function validarFormularioDeAviso(entrada: unknown): ValidacionDeAviso {
  const leido = leerFormulario(entrada)
  if (!leido) return { valido: false, errores: { general: ERROR_DE_FORMULARIO } }
  const errores = erroresDe(leido)
  if (Object.keys(errores).length > 0) return { valido: false, errores }
  return { valido: true, datos: { ...leido, correo: leido.correo || null } }
}
