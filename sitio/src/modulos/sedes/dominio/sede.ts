import {
  type EnlaceDeContacto,
  enlaceDeCorreo,
  enlaceDeLlamada,
} from '@/compartido/dominio/enlaces-de-contacto'

// Sede tal como se guarda en el panel (solo celulares, S9).
export interface SedeGuardada {
  nombre: string
  direccion: string
  distrito: string
  ciudad: string
  celulares: readonly string[]
  correo: string | null
}

export interface SedePublica {
  nombre: string
  direccion: string
  localidad: string
  celulares: EnlaceDeContacto[]
  correo: EnlaceDeContacto | null
}

export function prepararSede(sede: SedeGuardada): SedePublica {
  return {
    nombre: sede.nombre,
    direccion: sede.direccion,
    localidad: `${sede.distrito}, ${sede.ciudad}`,
    celulares: sede.celulares.map(enlaceDeLlamada),
    correo: sede.correo ? enlaceDeCorreo(sede.correo) : null,
  }
}
