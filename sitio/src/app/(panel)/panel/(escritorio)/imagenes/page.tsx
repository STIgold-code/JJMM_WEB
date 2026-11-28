import type { Metadata } from 'next'

import { obtenerImagenes } from '@/panel/aplicacion/consultar-imagenes'
import { PantallaDeImagenes } from '@/panel/componentes/imagenes/pantalla-de-imagenes'
import { leerConsultaDeImagenes, puedeEliminarImagenes } from '@/panel/dominio/imagenes'
import { crearRepositorioDeImagenes } from '@/panel/infraestructura/imagenes-payload'
import { exigirSesion, rolDeLaSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Imágenes' }

interface Props {
  searchParams: Promise<Readonly<Record<string, string | string[] | undefined>>>
}

// Biblioteca de imágenes: filtro, búsqueda, página e imagen abierta salen de la URL; las lecturas
// usan la Local API con los permisos de quien entra. Dónde se usa cada imagen se calcula aquí.
export default async function PaginaDeImagenes({ searchParams }: Props) {
  const sesion = await exigirSesion()
  const consulta = leerConsultaDeImagenes(await searchParams)
  const datos = await obtenerImagenes(crearRepositorioDeImagenes(sesion), consulta)
  return (
    <PantallaDeImagenes
      consulta={consulta}
      datos={datos}
      puedeEliminar={puedeEliminarImagenes(rolDeLaSesion(sesion))}
    />
  )
}
