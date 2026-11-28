'use client'

import { RUTA_DE_SUBIDA_DE_IMAGENES } from '../../dominio/imagenes'
import { leerRespuestaDeSubida, type RespuestaDeSubida } from '../../dominio/selector-de-imagen'

// Sube un archivo al manejador del panel con su texto alternativo. Usa `XMLHttpRequest` porque
// `fetch` no informa el avance de la subida. Nunca lanza: una red caída o una respuesta que no es
// la esperada vuelven como error con un texto propio.
export function subirImagen(
  archivo: File,
  alt: string,
  alAvanzar: (porcentaje: number) => void,
): Promise<RespuestaDeSubida> {
  return new Promise((resolver) => {
    const peticion = new XMLHttpRequest()
    peticion.open('POST', RUTA_DE_SUBIDA_DE_IMAGENES)
    peticion.responseType = 'json'
    peticion.upload.onprogress = (evento) => {
      if (evento.lengthComputable) alAvanzar(Math.round((evento.loaded / evento.total) * 100))
    }
    peticion.onload = () => resolver(leerRespuestaDeSubida(peticion.response))
    peticion.onerror = () => resolver(leerRespuestaDeSubida(null))
    const datos = new FormData()
    datos.set('alt', alt)
    datos.set('archivo', archivo)
    peticion.send(datos)
  })
}
