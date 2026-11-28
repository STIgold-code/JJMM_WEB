import type { NombreDeIcono } from './iconos'
import { RUTA_DE_PLANES } from './planes'
import type { Aviso } from './respuesta-al-mensaje'
import { RUTA_DEL_INICIO } from './rutas-del-panel'
import { RUTA_DE_SEDES } from './sedes'

// Página de inicio del sitio (global `pagina-de-inicio`): sus secciones en orden y, por ahora,
// el editor del carrusel de portadas. Las demás secciones aún no tienen pantalla aprobada.
export const RUTA_DE_LA_PAGINA_DE_INICIO = `${RUTA_DEL_INICIO}/pagina-de-inicio`
export const RUTA_DEL_CARRUSEL = `${RUTA_DE_LA_PAGINA_DE_INICIO}/portadas`
export const TIPO_CARRUSEL = 'carrusel-de-portadas'

export const rutaDelCarrusel = (seccion: string): string =>
  `${RUTA_DEL_CARRUSEL}?seccion=${encodeURIComponent(seccion)}`

// Lo que la lista necesita de cada sección guardada (lo lee el adaptador de Payload).
export interface SeccionLeida {
  id: string | null
  tipo: string
  titulo: string | null
  portadas: number | null
  segundos: number | null
  cifras: number | null
}

export interface SeccionDelPanel {
  // Clave estable para React: el id del bloque o, sin él, su posición.
  clave: string
  id: string | null
  nombre: string
  detalle: string
  icono: NombreDeIcono
  // Ruta de su editor; `null`: aún no se edita en el panel («Próximamente»).
  editar: string | null
  // La lista que muestra la sección se edita en otra pantalla.
  irA: { texto: string; ruta: string } | null
}

const plural = (cantidad: number, uno: string, varios: string) =>
  `${cantidad} ${cantidad === 1 ? uno : varios}`

interface Descripcion {
  nombre: string
  icono: NombreDeIcono
  detalle: (seccion: SeccionLeida) => string
  irA?: SeccionDelPanel['irA']
}

const DESCRIPCIONES: Readonly<Record<string, Descripcion>> = {
  [TIPO_CARRUSEL]: {
    nombre: 'Carrusel de portadas',
    icono: 'diseno',
    detalle: ({ portadas, segundos }) =>
      `${plural(portadas ?? 0, 'portada', 'portadas')}, ${plural(segundos ?? 0, 'segundo', 'segundos')} cada una`,
  },
  'quienes-somos': {
    nombre: 'Quiénes somos',
    icono: 'edificio',
    detalle: ({ cifras }) =>
      cifras
        ? `Presentación del estudio y ${plural(cifras, 'cifra', 'cifras')}`
        : 'Presentación del estudio',
  },
  servicios: {
    nombre: 'Nuestros servicios',
    icono: 'maletin',
    detalle: () => 'Rueda SIGE Mype con las áreas de servicio',
  },
  planes: {
    nombre: 'Nuestros planes',
    icono: 'capas',
    detalle: () => 'Tabla de planes; los planes se editan en Planes',
    irA: { texto: 'Ir a Planes', ruta: RUTA_DE_PLANES },
  },
  'por-que-elegirnos': {
    nombre: '¿Por qué elegirnos?',
    icono: 'estrella',
    detalle: () => 'Los valores del estudio, cada uno con su ícono',
  },
  clientes: {
    nombre: 'Nuestros clientes',
    icono: 'edificio',
    detalle: () => 'Logotipos de clientes',
  },
  contacto: {
    nombre: 'Contáctanos',
    icono: 'pin',
    detalle: () => 'Una pestaña por sede visible y el formulario',
    irA: { texto: 'Ir a Sedes', ruta: RUTA_DE_SEDES },
  },
}

const DESCONOCIDA: Descripcion = {
  nombre: 'Sección sin nombre',
  icono: 'lista',
  detalle: () => 'El panel aún no reconoce esta sección; se conserva tal cual.',
}

// Nombre, detalle e ícono de una sección, como la maqueta: su título si lo tiene.
export function resumenDeSeccion(seccion: SeccionLeida, posicion = 0): SeccionDelPanel {
  const descripcion = DESCRIPCIONES[seccion.tipo] ?? DESCONOCIDA
  const editable = seccion.tipo === TIPO_CARRUSEL && seccion.id !== null
  return {
    clave: seccion.id ?? `posicion-${posicion}`,
    id: seccion.id,
    nombre: seccion.titulo?.trim() || descripcion.nombre,
    detalle: descripcion.detalle(seccion),
    icono: descripcion.icono,
    editar: editable && seccion.id ? rutaDelCarrusel(seccion.id) : null,
    irA: descripcion.irA ?? null,
  }
}

export const ERROR_DESACTUALIZADA =
  'Alguien guardó cambios en la página de inicio mientras editabas. Recarga la página para ver lo último; tus cambios no se guardaron.'
export const ERROR_SIN_CARRUSEL =
  'El carrusel ya no está en la página de inicio. Recarga la página.'
export const ERROR_DATOS_DE_LA_PAGINA =
  'No se pudo guardar: la página de inicio tiene datos que no son válidos. Recarga la página e inténtalo de nuevo.'

export const AVISO_DE_ORDEN: Aviso = {
  titulo: 'Orden guardado',
  detalle: 'El inicio del sitio ya muestra las secciones en este orden.',
}
export const AVISO_DEL_CARRUSEL: Aviso = {
  titulo: 'Carrusel guardado',
  detalle: 'El carrusel del inicio ya muestra los cambios.',
}
