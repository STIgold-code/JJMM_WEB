import { type Paginacion, paginacion } from '../dominio/lista-de-mensajes'
import { leerId } from '../dominio/identificadores'
import { type ImagenElegida, leerImagenElegida } from '../dominio/selector-de-imagen'
import {
  contarSiHace,
  filtroDeLectura,
  type ImagenDelPanel,
  type RepositorioDeLecturaDeImagenes,
} from './consultar-imagenes'

// «Elegir de Imágenes» del selector: la biblioteca paginada y con buscador, dentro de un diálogo.
export const IMAGENES_POR_PAGINA_AL_ELEGIR = 12
const LARGO_MAXIMO_DE_BUSQUEDA = 100

export interface PaginaParaElegir {
  imagenes: ImagenElegida[]
  paginacion: Paginacion
}

// Una imagen sin dirección de medios válida no se puede mostrar ni elegir.
const aElegida = (imagen: ImagenDelPanel): ImagenElegida | null => leerImagenElegida(imagen)

// Todo lo que llega del navegador es `unknown`: una búsqueda que no es texto no busca y una
// página inválida es la primera.
export async function buscarImagenesParaElegir(
  repositorio: Pick<RepositorioDeLecturaDeImagenes, 'contar' | 'listar'>,
  entrada: { busqueda: unknown; pagina: unknown },
): Promise<PaginaParaElegir> {
  const texto = typeof entrada.busqueda === 'string' ? entrada.busqueda : ''
  const busqueda = texto.trim().slice(0, LARGO_MAXIMO_DE_BUSQUEDA)
  const filtro = filtroDeLectura('todas', busqueda, [])
  const total = await contarSiHace(repositorio, filtro)
  const pagina = paginacion(total, leerId(entrada.pagina) ?? 1, IMAGENES_POR_PAGINA_AL_ELEGIR)
  const imagenes =
    total > 0 ? await repositorio.listar(filtro, pagina.pagina, IMAGENES_POR_PAGINA_AL_ELEGIR) : []
  return {
    imagenes: imagenes.flatMap((imagen) => aElegida(imagen) ?? []),
    paginacion: pagina,
  }
}
