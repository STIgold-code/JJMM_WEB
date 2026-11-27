import type { Metadata } from 'next'

import { RenderizadorDeBloques } from '@/compartido/componentes/bloques/renderizador-de-bloques'
import { obtenerDatosDelSitio } from '@/compartido/componentes/estructura/datos-del-sitio'
import { metadatosDeInicio } from '@/compartido/componentes/estructura/metadatos-por-defecto'
import { obtenerSeccionesDeInicio } from '@/modulos/portada/componentes/obtener-secciones-de-inicio'
import { REGISTRO_DE_INICIO } from '@/modulos/portada/componentes/registro-de-inicio'

import { DatosEstructuradosDelEstudio } from './datos-estructurados-del-estudio'

export async function generateMetadata(): Promise<Metadata> {
  return metadatosDeInicio(await obtenerDatosDelSitio())
}

// Inicio (S5): las secciones de la global `pagina-de-inicio`, en el orden del panel.
export default async function PaginaInicio() {
  const secciones = await obtenerSeccionesDeInicio()
  return (
    <>
      <DatosEstructuradosDelEstudio />
      <RenderizadorDeBloques bloques={secciones} registro={REGISTRO_DE_INICIO} />
    </>
  )
}
