import { RenderizadorDeBloques } from '@/compartido/componentes/bloques/renderizador-de-bloques'
import { obtenerSeccionesDeInicio } from '@/modulos/portada/componentes/obtener-secciones-de-inicio'
import { REGISTRO_DE_INICIO } from '@/modulos/portada/componentes/registro-de-inicio'

// Inicio (S5): las secciones de la global `pagina-de-inicio`, en el orden del panel.
export default async function PaginaInicio() {
  const secciones = await obtenerSeccionesDeInicio()
  return <RenderizadorDeBloques bloques={secciones} registro={REGISTRO_DE_INICIO} />
}
