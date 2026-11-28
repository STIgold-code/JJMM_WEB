import type { ValorDelPanel } from '../dominio/valores'

// Textos de la sección «¿Por qué elegirnos?» de la página de inicio, para la vista previa.
export interface TextosDePorQueElegirnos {
  titulo: string
  bajada: string | null
}

// Lecturas con los permisos de quien entra. Los valores, en el orden del sitio.
export interface RepositorioDeLecturaDeValores {
  listarValores(): Promise<ValorDelPanel[]>
  // `null` si la página de inicio no tiene la sección.
  leerTextosDeLaSeccion(): Promise<TextosDePorQueElegirnos | null>
}

export interface DatosDeValores {
  valores: ValorDelPanel[]
  textos: TextosDePorQueElegirnos
}

const TEXTOS_PREDETERMINADOS: TextosDePorQueElegirnos = {
  titulo: '¿Por qué elegirnos?',
  bajada: null,
}

export async function obtenerValores(
  repositorio: RepositorioDeLecturaDeValores,
): Promise<DatosDeValores> {
  const [valores, textos] = await Promise.all([
    repositorio.listarValores(),
    repositorio.leerTextosDeLaSeccion(),
  ])
  return { valores, textos: textos ?? TEXTOS_PREDETERMINADOS }
}
