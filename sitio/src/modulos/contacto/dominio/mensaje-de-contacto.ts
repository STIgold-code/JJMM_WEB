// Mensaje del formulario «Escríbenos»: los tres campos de la v5 (nombre, servicio y caso). La
// respuesta llega por el WhatsApp desde el que escribe la persona, así que no se le pide más.
// Las mismas reglas validan en el navegador (respuesta inmediata) y en el servidor (la que
// vale). Los límites coinciden con `mensajes-de-contacto`.
export const CAMPOS_DEL_MENSAJE = ['nombre', 'servicio', 'mensaje'] as const
export type CampoDelMensaje = (typeof CAMPOS_DEL_MENSAJE)[number]

export type DatosDelFormulario = Record<CampoDelMensaje, string>
export type ErroresDelMensaje = Partial<Record<CampoDelMensaje, string>>

export interface MensajeDeContacto {
  nombre: string
  servicio: string | null
  mensaje: string
}

export type ValidacionDelMensaje =
  { valido: true; mensaje: MensajeDeContacto } | { valido: false; errores: ErroresDelMensaje }

const MAXIMO = { nombre: 120, servicio: 120, mensaje: 2000 } as const

const maximo = (limite: number) => `Usa como máximo ${limite} caracteres.`

const exigido =
  (vacio: string, regla: (valor: string) => string | null) =>
  (valor: string): string | null =>
    valor ? regla(valor) : vacio

const largo = (limite: number) => (valor: string) => (valor.length > limite ? maximo(limite) : null)

const REGLAS: Record<CampoDelMensaje, (valor: string) => string | null> = {
  nombre: exigido('Escribe tu nombre para saber cómo dirigirnos a ti.', largo(MAXIMO.nombre)),
  servicio: largo(MAXIMO.servicio),
  mensaje: exigido('Cuéntanos en una línea qué necesitas.', largo(MAXIMO.mensaje)),
}

const limpiar = (datos: DatosDelFormulario): DatosDelFormulario => ({
  nombre: datos.nombre.trim(),
  servicio: datos.servicio.trim(),
  mensaje: datos.mensaje.trim(),
})

export function validarMensajeDeContacto(datos: DatosDelFormulario): ValidacionDelMensaje {
  const limpios = limpiar(datos)
  const errores: ErroresDelMensaje = {}
  for (const campo of CAMPOS_DEL_MENSAJE) {
    const error = REGLAS[campo](limpios[campo])
    if (error) errores[campo] = error
  }
  if (Object.keys(errores).length > 0) return { valido: false, errores }
  return {
    valido: true,
    mensaje: {
      nombre: limpios.nombre,
      servicio: limpios.servicio || null,
      mensaje: limpios.mensaje,
    },
  }
}

export function primerCampoConError(errores: ErroresDelMensaje): CampoDelMensaje | null {
  return CAMPOS_DEL_MENSAJE.find((campo) => errores[campo]) ?? null
}

// Texto que llega al WhatsApp del estudio, como en la v5.
export function textoParaWhatsApp({ nombre, servicio, mensaje }: MensajeDeContacto): string {
  const necesidad = servicio ? ` Necesito: ${servicio}.` : ''
  return `Hola, soy ${nombre}.${necesidad} ${mensaje}`
}
