'use server'

import { headers } from 'next/headers'

import { crearEnviarMensajeDeContacto } from '../aplicacion/enviar-mensaje-de-contacto'
import { ENCABEZADO_POR_DEFECTO, ipDeLaPeticion } from '../infraestructura/ip-de-la-peticion'
import { limitadorDeContacto } from '../infraestructura/limitador-de-contacto'
import { notificadorSinCorreo } from '../infraestructura/notificador-sin-correo'
import { repositorioMensajesPayload } from '../infraestructura/repositorio-mensajes-payload'
import {
  aEstado,
  type EstadoDelFormulario,
  leerDatos,
  leerInicio,
  leerTrampa,
} from './estado-del-formulario'

// Raíz de composición del envío: caso de uso + Payload + aviso + límite por dirección.
const enviar = crearEnviarMensajeDeContacto({
  repositorio: repositorioMensajesPayload,
  notificador: notificadorSinCorreo,
  limitador: limitadorDeContacto,
})

// Acción del servidor del formulario «Escríbenos». Valida de nuevo (la del navegador es solo
// una ayuda) y guarda el mensaje. Un error al guardar se registra y se informa a la persona.
export async function enviarMensajeDeContacto(
  _anterior: EstadoDelFormulario,
  formulario: FormData,
): Promise<EstadoDelFormulario> {
  const datos = leerDatos(formulario)
  const encabezado = process.env.ENCABEZADO_IP_CLIENTE || ENCABEZADO_POR_DEFECTO
  try {
    const resultado = await enviar({
      datos,
      trampa: leerTrampa(formulario),
      inicioEn: leerInicio(formulario),
      ip: ipDeLaPeticion(await headers(), encabezado),
      ahora: Date.now(),
    })
    return aEstado(resultado, datos)
  } catch (error) {
    console.error('No se pudo guardar el mensaje de contacto.', error)
    return { estado: 'error', valores: datos }
  }
}
