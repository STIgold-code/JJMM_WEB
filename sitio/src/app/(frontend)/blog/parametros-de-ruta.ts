// Props que Next entrega a las páginas del blog (en Next 16 son promesas).
export type ParametrosDeBusqueda = Promise<Record<string, string | string[] | undefined>>

export interface PropsDeListado {
  searchParams: ParametrosDeBusqueda
}

export interface PropsConSlug {
  params: Promise<{ slug: string }>
}

export interface PropsDeListadoConSlug extends PropsConSlug, PropsDeListado {}
