import { esCelularPeruano } from '../../dominio/celular'
import { esUrlHttps, TIPOS_DE_DESTINO, validarDestino } from '../../dominio/destino-de-enlace'
import { esSlugValido } from '../../dominio/slug'

// Adaptadores entre las reglas de dominio y la firma `validate` de Payload: reciben el valor
// sin tipar y devuelven `true` o el mensaje que ve quien edita. Un `validate` propio reemplaza
// la validación de `required`, así que cada adaptador decide qué hacer con el campo vacío.
type ResultadoDeValidacion = true | string

const MENSAJE_CELULAR =
  'Ingresa un celular peruano de 9 dígitos que empiece con 9. No se publican teléfonos fijos.'
const MENSAJE_URL = 'Ingresa una dirección https://, por ejemplo https://www.facebook.com/…'
const MENSAJE_SLUG = 'Usa solo minúsculas sin tildes, números y guiones simples.'

export function comoTexto(valor: unknown): string {
  return typeof valor === 'string' ? valor.trim() : ''
}

export function leerCampo(datos: unknown, nombre: string): unknown {
  if (typeof datos !== 'object' || datos === null) return undefined
  return Reflect.get(datos, nombre)
}

const opcional =
  (regla: (valor: unknown) => ResultadoDeValidacion) =>
  (valor: unknown): ResultadoDeValidacion =>
    comoTexto(valor) === '' ? true : regla(valor)

export const validarCelular = (valor: unknown): ResultadoDeValidacion =>
  esCelularPeruano(comoTexto(valor)) || MENSAJE_CELULAR

export const validarCelularOpcional = opcional(validarCelular)

export const validarUrlHttps = (valor: unknown): ResultadoDeValidacion =>
  esUrlHttps(comoTexto(valor)) || MENSAJE_URL

export const validarUrlHttpsOpcional = opcional(validarUrlHttps)

export const validarSlug = (valor: unknown): ResultadoDeValidacion =>
  esSlugValido(comoTexto(valor)) || MENSAJE_SLUG

// El destino se valida según el `tipo` hermano. Otros tipos (por ejemplo, WhatsApp en un
// botón) no usan destino.
export const validarDestinoSegunTipo = (
  valor: unknown,
  { siblingData }: { siblingData: unknown },
): ResultadoDeValidacion => {
  const tipo = TIPOS_DE_DESTINO.find((t) => t === leerCampo(siblingData, 'tipo'))
  if (!tipo) return true
  return validarDestino(tipo, comoTexto(valor)) ?? true
}
