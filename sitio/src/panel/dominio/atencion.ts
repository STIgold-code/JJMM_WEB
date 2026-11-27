import type { NombreDeIcono } from './iconos'
import { listaEnAdmin } from './rutas-del-panel'

// Tarjetas «Requiere atención» del inicio. Cada conteo es `null` cuando la cuenta no puede
// leer esa colección: la tarjeta no se muestra, nunca se inventa un cero.
export interface ConteosDeAtencion {
  mensajesNuevos: number | null
  borradores: number | null
  datosPorCompletar: number | null
}

export interface TarjetaDeAtencion {
  clave: 'mensajes' | 'borradores' | 'datos'
  cantidad: number
  pendiente: boolean
  titulo: string
  detalle: string
  icono: NombreDeIcono
  href: string
}

type Definicion = Omit<TarjetaDeAtencion, 'cantidad' | 'pendiente' | 'detalle'> & {
  conPendiente: string
  sinPendiente: string
}

const DEFINICIONES: readonly Definicion[] = [
  {
    clave: 'mensajes',
    titulo: 'Mensajes sin atender',
    conPendiente: 'Respóndelos y márcalos como atendidos',
    sinPendiente: 'Todos los mensajes están atendidos',
    icono: 'bandeja',
    href: listaEnAdmin('mensajes-de-contacto', '?where[estado][equals]=nuevo'),
  },
  {
    clave: 'borradores',
    titulo: 'Borradores sin publicar',
    conPendiente: 'Revísalos y publícalos cuando estén listos',
    sinPendiente: 'No hay borradores pendientes',
    icono: 'periodico',
    href: listaEnAdmin('publicaciones', '?where[_status][equals]=draft'),
  },
  {
    clave: 'datos',
    titulo: 'Datos por completar',
    conPendiente: 'Datos del sitio por completar o confirmar',
    sinPendiente: 'El contenido del sitio está completo',
    icono: 'tareas',
    href: '#lo-que-falta',
  },
]

const CONTEO: Readonly<Record<TarjetaDeAtencion['clave'], keyof ConteosDeAtencion>> = {
  mensajes: 'mensajesNuevos',
  borradores: 'borradores',
  datos: 'datosPorCompletar',
}

export function tarjetasDeAtencion(conteos: ConteosDeAtencion): TarjetaDeAtencion[] {
  return DEFINICIONES.flatMap(({ conPendiente, sinPendiente, ...definicion }) => {
    const cantidad = conteos[CONTEO[definicion.clave]]
    if (cantidad === null) return []
    const pendiente = cantidad > 0
    return [
      { ...definicion, cantidad, pendiente, detalle: pendiente ? conPendiente : sinPendiente },
    ]
  })
}
