import type { Metadata } from 'next'

import { obtenerEdicionDelCarrusel } from '@/panel/aplicacion/consultar-pagina-de-inicio'
import { CarruselNoEncontrado } from '@/panel/componentes/carrusel/carrusel-no-encontrado'
import { EdicionDelCarrusel } from '@/panel/componentes/carrusel/edicion-del-carrusel'
import { crearLecturaDeLaPaginaDeInicio } from '@/panel/infraestructura/lectura-de-la-pagina-de-inicio-payload'
import { exigirSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Carrusel de portadas' }

interface Props {
  searchParams: Promise<{ seccion?: string | string[] }>
}

// Editor del carrusel de portadas de la página de inicio. `seccion` (el id del bloque) elige el
// carrusel; sin ella, el primero de la página. Se valida antes de consultar.
export default async function PaginaDelCarrusel({ searchParams }: Props) {
  const sesion = await exigirSesion()
  const { seccion } = await searchParams
  const formulario = await obtenerEdicionDelCarrusel(
    crearLecturaDeLaPaginaDeInicio(sesion),
    seccion,
  )
  if (!formulario) return <CarruselNoEncontrado />
  // `key`: al cambiar de carrusel el formulario empieza de nuevo.
  return <EdicionDelCarrusel key={formulario.seccion} guardado={formulario} />
}
