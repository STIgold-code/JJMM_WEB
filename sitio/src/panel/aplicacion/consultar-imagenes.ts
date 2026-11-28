import {
  type ConsultaDeImagenes,
  type ConteosDeImagenes,
  FILTROS_DE_IMAGENES,
  type FiltroDeImagenes,
  type FiltroDeImagenesConConteo,
  filtrosDeImagenesConConteo,
  IMAGENES_POR_PAGINA,
} from '../dominio/imagenes'
import { type Paginacion, paginacion } from '../dominio/lista-de-mensajes'
import {
  idsDelFiltro,
  type IdsDelFiltro,
  idsQueCoincidenPorUso,
  type UsoDeImagen,
  usosPorImagen,
} from '../dominio/usos-de-imagenes'

// Una imagen de la biblioteca, con lo que guarda la colección `medios`.
export interface ImagenDelPanel {
  id: number
  nombre: string
  alt: string
  // `null` si el archivo no tiene una dirección de medios válida (no se dibuja).
  url: string | null
  ancho: number | null
  alto: number | null
  mime: string | null
  tamano: number | null
}

export interface ImagenConUsos extends ImagenDelPanel {
  usos: UsoDeImagen[]
}

// `ids`: lo que deja ver el filtro; `busqueda` busca en el nombre y el texto alternativo, y
// `idsPorUso` suma las imágenes cuyo uso coincide.
export interface FiltroDeLectura {
  ids: IdsDelFiltro
  busqueda: string
  idsPorUso: number[]
}

// Lecturas de la biblioteca, siempre con los permisos de quien entra. `listar` trae lo más
// reciente primero y con tope (`limite`); `usos` recorre todo lo que apunta a `medios`.
export interface RepositorioDeLecturaDeImagenes {
  usos(): Promise<UsoDeImagen[]>
  contar(filtro: FiltroDeLectura): Promise<number>
  listar(filtro: FiltroDeLectura, pagina: number, limite: number): Promise<ImagenDelPanel[]>
  buscar(id: number): Promise<ImagenDelPanel | null>
}

export interface DatosDeImagenes {
  // `false`: la biblioteca está vacía (estado vacío propio, distinto de «sin resultados»).
  hayImagenes: boolean
  filtros: FiltroDeImagenesConConteo[]
  imagenes: ImagenConUsos[]
  paginacion: Paginacion
  // La imagen abierta en el panel lateral, aunque no esté en la página que se ve.
  seleccionada: ImagenConUsos | null
}

// Un filtro que incluye una lista vacía no puede devolver nada: no se consulta.
const noDevuelveNada = (filtro: FiltroDeLectura): boolean =>
  filtro.ids !== null && 'incluir' in filtro.ids && filtro.ids.incluir.length === 0

export function filtroDeLectura(
  filtro: FiltroDeImagenes,
  busqueda: string,
  usos: readonly UsoDeImagen[],
): FiltroDeLectura {
  return {
    ids: idsDelFiltro(filtro, usos),
    busqueda,
    idsPorUso: idsQueCoincidenPorUso(usos, busqueda),
  }
}

export function contarSiHace(
  repositorio: Pick<RepositorioDeLecturaDeImagenes, 'contar'>,
  filtro: FiltroDeLectura,
): Promise<number> {
  return noDevuelveNada(filtro) ? Promise.resolve(0) : repositorio.contar(filtro)
}

async function contarFiltros(
  repositorio: RepositorioDeLecturaDeImagenes,
  busqueda: string,
  usos: readonly UsoDeImagen[],
): Promise<ConteosDeImagenes> {
  const cantidades = await Promise.all(
    FILTROS_DE_IMAGENES.map((filtro) =>
      contarSiHace(repositorio, filtroDeLectura(filtro, busqueda, usos)),
    ),
  )
  const conteos = Object.fromEntries(
    FILTROS_DE_IMAGENES.map((filtro, indice) => [filtro, cantidades[indice] ?? 0]),
  )
  // Las claves son exactamente FILTROS_DE_IMAGENES.
  return conteos as ConteosDeImagenes
}

const conUsos = (porImagen: Map<number, UsoDeImagen[]>) => (imagen: ImagenDelPanel) => ({
  ...imagen,
  usos: porImagen.get(imagen.id) ?? [],
})

export async function obtenerImagenes(
  repositorio: RepositorioDeLecturaDeImagenes,
  consulta: ConsultaDeImagenes,
): Promise<DatosDeImagenes> {
  const usos = await repositorio.usos()
  const conteos = await contarFiltros(repositorio, consulta.busqueda, usos)
  const total = consulta.busqueda
    ? await repositorio.contar(filtroDeLectura('todas', '', []))
    : conteos.todas
  const pagina = paginacion(conteos[consulta.filtro], consulta.pagina, IMAGENES_POR_PAGINA)
  const filtro = filtroDeLectura(consulta.filtro, consulta.busqueda, usos)
  const [imagenes, seleccionada] = await Promise.all([
    pagina.total > 0 ? repositorio.listar(filtro, pagina.pagina, IMAGENES_POR_PAGINA) : [],
    consulta.imagen ? repositorio.buscar(consulta.imagen) : null,
  ])
  const agregarUsos = conUsos(usosPorImagen(usos))
  return {
    hayImagenes: total > 0,
    filtros: filtrosDeImagenesConConteo(conteos),
    imagenes: imagenes.map(agregarUsos),
    paginacion: pagina,
    seleccionada: seleccionada ? agregarUsos(seleccionada) : null,
  }
}
