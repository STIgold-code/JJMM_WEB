import {
  type FiltroConConteo,
  filtrosConConteo,
  MENSAJES_POR_PAGINA,
  type Paginacion,
  paginacion,
} from '../dominio/lista-de-mensajes'
import { type ConsultaDeMensajes, type EstadoDeMensaje, estadoDelFiltro } from '../dominio/mensajes'

// Un mensaje del formulario «Contáctanos», con lo que el equipo anotó al responder.
export interface MensajeDeContacto {
  id: number
  nombre: string
  servicio: string | null
  mensaje: string
  estado: EstadoDeMensaje
  celular: string | null
  correo: string | null
  // Fecha ISO de llegada.
  recibido: string
}

// `estado: null` no filtra por estado; `busqueda` vacía no filtra por texto.
export interface FiltroDeLectura {
  estado: EstadoDeMensaje | null
  busqueda: string
}

// Lecturas del listado, siempre con los permisos de quien entra. `listar` trae lo más reciente
// primero y con tope (`limite`).
export interface RepositorioDeLecturaDeMensajes {
  contar(filtro: FiltroDeLectura): Promise<number>
  listar(filtro: FiltroDeLectura, pagina: number, limite: number): Promise<MensajeDeContacto[]>
  buscar(id: number): Promise<MensajeDeContacto | null>
}

export interface DatosDeMensajes {
  // `false`: aún no llega ningún mensaje (estado vacío propio, distinto de «sin resultados»).
  hayMensajes: boolean
  filtros: FiltroConConteo[]
  mensajes: MensajeDeContacto[]
  paginacion: Paginacion
  // El mensaje abierto en el panel lateral, aunque no esté en la página que se ve.
  seleccionado: MensajeDeContacto | null
}

async function contarFiltros(repositorio: RepositorioDeLecturaDeMensajes, busqueda: string) {
  const [nuevos, atendidos, sinFiltro] = await Promise.all([
    repositorio.contar({ estado: 'nuevo', busqueda }),
    repositorio.contar({ estado: 'atendido', busqueda }),
    busqueda ? repositorio.contar({ estado: null, busqueda: '' }) : null,
  ])
  return { nuevos, atendidos, total: sinFiltro ?? nuevos + atendidos }
}

export async function obtenerMensajes(
  repositorio: RepositorioDeLecturaDeMensajes,
  consulta: ConsultaDeMensajes,
): Promise<DatosDeMensajes> {
  const { nuevos, atendidos, total } = await contarFiltros(repositorio, consulta.busqueda)
  const filtros = filtrosConConteo({ nuevos, atendidos })
  const cantidad = filtros.find((f) => f.filtro === consulta.filtro)?.cantidad ?? 0
  const pagina = paginacion(cantidad, consulta.pagina)
  const filtro = { estado: estadoDelFiltro(consulta.filtro), busqueda: consulta.busqueda }
  const [mensajes, seleccionado] = await Promise.all([
    cantidad > 0 ? repositorio.listar(filtro, pagina.pagina, MENSAJES_POR_PAGINA) : [],
    consulta.mensaje ? repositorio.buscar(consulta.mensaje) : null,
  ])
  return { hayMensajes: total > 0, filtros, mensajes, paginacion: pagina, seleccionado }
}
