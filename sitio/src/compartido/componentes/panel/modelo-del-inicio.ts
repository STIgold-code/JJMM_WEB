import type { NombreDeTrazo } from './trazos-del-panel'

// Datos que dibuja el inicio del panel. Los arma infraestructura (`cifras-del-panel.ts`,
// `secciones-del-panel.ts`) con los conteos y permisos de Payload.

// Algo que pide acción (mensajes por responder, borradores sin publicar), con enlace a su lista.
export interface Pendiente {
  clave: string
  texto: string
  // Nombre del enlace: dice a dónde lleva.
  accion: string
  href: string
  icono: NombreDeTrazo
  urgente: boolean
}

// Una colección o global dentro de su sección. `cantidad` es `null` en las globales.
export interface EntradaDeSeccion {
  clave: string
  etiqueta: string
  descripcion: string
  href: string
  icono: NombreDeTrazo
  cantidad: number | null
}

export interface SeccionDelInicio {
  grupo: string
  entradas: EntradaDeSeccion[]
}
