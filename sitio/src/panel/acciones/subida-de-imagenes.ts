import { revalidatePath } from 'next/cache'

import { subirImagen } from '../aplicacion/subir-imagen'
import { RUTA_DEL_INICIO } from '../dominio/rutas-del-panel'
import type { RespuestaDeSubida } from '../dominio/selector-de-imagen'
import { esDelMismoOrigen, TAMANO_MAXIMO_DE_IMAGEN } from '../dominio/subida-de-imagenes'
import { crearRepositorioDeImagenes } from '../infraestructura/imagenes-payload'
import { obtenerSesion } from '../infraestructura/sesion-del-panel'

// Margen para las cabeceras del multipart y el texto alternativo, sobre el tope del archivo.
const MARGEN_DEL_FORMULARIO = 64 * 1024
const LARGO_MAXIMO_DEL_CUERPO = TAMANO_MAXIMO_DE_IMAGEN + MARGEN_DEL_FORMULARIO

export const ERROR_SIN_SESION = 'Tu sesión terminó. Vuelve a ingresar al panel.'
export const ERROR_DE_ORIGEN = 'La subida no vino de este panel.'
export const ERROR_DE_CUERPO_GRANDE = 'La imagen pesa más de 10 MB. Redúcela y vuelve a intentarlo.'
export const ERROR_DE_FORMULARIO_DE_SUBIDA = 'No se pudo leer el archivo. Vuelve a elegirlo.'

const responder = (respuesta: RespuestaDeSubida, status: number): Response =>
  Response.json(respuesta, { status, headers: { 'Cache-Control': 'no-store' } })

const rechazo = (error: string, status: number) => responder({ estado: 'error', error }, status)

function esDelPanel(request: Request): boolean {
  const { headers } = request
  return esDelMismoOrigen({
    origen: headers.get('origin'),
    host: headers.get('host'),
    hostReenviado: headers.get('x-forwarded-host'),
  })
}

// El cuerpo se lee entero en memoria: sin un largo declarado o con uno mayor que el tope, no se
// lee. (`fetch` y `XMLHttpRequest` siempre declaran el largo de un FormData).
function cuerpoPermitido(request: Request): boolean {
  const largo = Number(request.headers.get('content-length'))
  return Number.isSafeInteger(largo) && largo > 0 && largo <= LARGO_MAXIMO_DEL_CUERPO
}

async function leerFormulario(request: Request) {
  try {
    const formulario = await request.formData()
    const archivo = formulario.get('archivo')
    if (!(archivo instanceof File)) return null
    return { archivo, alt: formulario.get('alt') }
  } catch {
    return null
  }
}

// Subida de una imagen del panel (manejador de ruta POST: una acción de servidor solo acepta
// 1 MB por defecto). Orden: sesión (sin ella, 401 sin tocar Payload), mismo origen (CSRF), tope
// del cuerpo, formulario, y la validación del caso de uso (tipo real, tamaño, texto alternativo).
export async function atenderSubidaDeImagen(request: Request): Promise<Response> {
  const sesion = await obtenerSesion()
  if (!sesion) return rechazo(ERROR_SIN_SESION, 401)
  if (!esDelPanel(request)) return rechazo(ERROR_DE_ORIGEN, 403)
  if (!cuerpoPermitido(request)) return rechazo(ERROR_DE_CUERPO_GRANDE, 413)
  const formulario = await leerFormulario(request)
  if (!formulario) return rechazo(ERROR_DE_FORMULARIO_DE_SUBIDA, 400)
  const { archivo, alt } = formulario
  const bytes = new Uint8Array(await archivo.arrayBuffer())
  const repositorio = crearRepositorioDeImagenes(sesion)
  const respuesta = await subirImagen(repositorio, { bytes, nombre: archivo.name, alt })
  if (respuesta.estado !== 'subida') return responder(respuesta, 422)
  revalidatePath(RUTA_DEL_INICIO, 'layout')
  return responder(respuesta, 201)
}
