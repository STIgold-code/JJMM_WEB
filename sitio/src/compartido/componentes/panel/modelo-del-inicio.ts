import type { NombreDeTrazo } from './trazos-del-panel'

// Datos que dibuja el inicio del panel. Los arma infraestructura (`cifras-del-panel.ts`,
// `secciones-del-panel.ts`) con los conteos y permisos de Payload.

// Una cifra real del resumen, con enlace a la lista que la explica.
export interface Cifra {
  clave: string
  valor: number
  etiqueta: string
  detalle: string
  href: string
  icono: NombreDeTrazo
  destacada: boolean
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
