import { normalizarParaBuscar } from './busqueda'
import type { Aviso } from './respuesta-al-mensaje'
import { RUTA_DEL_INICIO } from './rutas-del-panel'
import type { ImagenElegida } from './selector-de-imagen'

// Clientes del carrusel «Nuestros clientes» del inicio: logotipo, nombre (también su texto
// alternativo), sitio web opcional, orden y «Visible» (`activo`).
export const RUTA_DE_CLIENTES = `${RUTA_DEL_INICIO}/clientes`

export interface ClienteDelPanel {
  id: number
  nombre: string
  // `null`: la imagen ya no existe o no tiene una dirección válida.
  logo: ImagenElegida | null
  enlace: string | null
  visible: boolean
  orden: number
}

// El sitio publica los clientes cuyo nombre aún no se conoce como «Cliente del estudio (nombre
// por confirmar)». Se reconoce por el texto, nunca por su posición.
const POR_CONFIRMAR = /por confirmar/i

export const nombrePorConfirmar = (nombre: string): boolean => POR_CONFIRMAR.test(nombre)

function enumerar(posiciones: readonly number[]): string {
  if (posiciones.length < 2) return posiciones.join('')
  return `${posiciones.slice(0, -1).join(', ')} y ${posiciones.at(-1)}`
}

// Aviso de la maqueta con las posiciones (en el orden actual) de los nombres por confirmar.
export function avisoDeNombresPorConfirmar(clientes: readonly { nombre: string }[]) {
  const posiciones = clientes.flatMap((c, i) => (nombrePorConfirmar(c.nombre) ? [i + 1] : []))
  if (posiciones.length === 0) return null
  if (posiciones.length === 1)
    return `Un logotipo no tiene nombre confirmado (posición ${enumerar(posiciones)}).`
  return `${posiciones.length} logotipos no tienen nombre confirmado (posiciones ${enumerar(posiciones)}).`
}

export const secundarioDeCliente = ({ enlace }: Pick<ClienteDelPanel, 'enlace'>): string =>
  enlace ?? 'Sin sitio web'

// Filtros segmentados del listado, con su conteo.
export type FiltroDeClientes = 'todos' | 'visible' | 'oculta'

const cumple = (filtro: FiltroDeClientes, visible: boolean) =>
  filtro === 'todos' || (filtro === 'visible') === visible

export function filtrarClientes<T extends Pick<ClienteDelPanel, 'nombre' | 'visible'>>(
  clientes: readonly T[],
  filtro: FiltroDeClientes,
  busqueda: string,
): T[] {
  const texto = normalizarParaBuscar(busqueda)
  return clientes.filter(
    (c) => cumple(filtro, c.visible) && normalizarParaBuscar(c.nombre).includes(texto),
  )
}

export function conteosDeClientes(clientes: readonly Pick<ClienteDelPanel, 'visible'>[]) {
  const visibles = clientes.filter((c) => c.visible).length
  return { todos: clientes.length, visible: visibles, oculta: clientes.length - visibles }
}

// Lo que se escribe en el panel lateral. Un cliente nuevo empieza oculto, como en la maqueta.
export interface FormularioDeCliente {
  nombre: string
  enlace: string
  logo: ImagenElegida | null
  visible: boolean
}

export function formularioDeCliente(cliente: ClienteDelPanel | null): FormularioDeCliente {
  return {
    nombre: cliente?.nombre ?? '',
    enlace: cliente?.enlace ?? '',
    logo: cliente?.logo ?? null,
    visible: cliente?.visible ?? false,
  }
}

const clave = (f: FormularioDeCliente) =>
  JSON.stringify([f.nombre.trim(), f.enlace.trim(), f.logo?.id ?? null, f.visible])

export const hayCambiosEnElCliente = (original: FormularioDeCliente, actual: FormularioDeCliente) =>
  clave(original) !== clave(actual)

// Lo que el navegador manda a la acción: el logotipo como id.
export const formularioDeClienteParaGuardar = (f: FormularioDeCliente) => ({
  ...f,
  logo: f.logo?.id ?? null,
})

// Avisos breves tras escribir.
const EN_EL_CARRUSEL = 'El carrusel «Nuestros clientes» ya lo muestra.'

export const avisoDeClienteGuardado = (visible: boolean): Aviso => ({
  titulo: 'Cliente guardado',
  detalle: visible ? EN_EL_CARRUSEL : 'Está oculto: enciende «Visible» para mostrarlo.',
})

export const avisoDeClienteCreado = (visible: boolean): Aviso => ({
  titulo: 'Cliente creado',
  detalle: visible ? EN_EL_CARRUSEL : 'Quedó oculto y al final. Actívalo cuando quieras mostrarlo.',
})

export const avisoDeVisibilidadDeCliente = (nombre: string, visible: boolean): Aviso => ({
  titulo: visible
    ? `El logotipo de ${nombre} ya se ve en el sitio`
    : `El logotipo de ${nombre} quedó oculto`,
  detalle: 'Puedes cambiarlo cuando quieras.',
})

export const avisoDeClienteEliminado = (nombre: string): Aviso => ({
  titulo: 'Cliente eliminado',
  detalle: `Se borró ${nombre}. Su logotipo sigue en Imágenes.`,
})
