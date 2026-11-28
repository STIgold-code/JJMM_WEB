import type { Metadata } from 'next'

import { obtenerFilasDeLaTabla } from '@/panel/aplicacion/consultar-planes'
import { PantallaDeFilas } from '@/panel/componentes/filas/pantalla-de-filas'
import { puedeEliminarDelCatalogo } from '@/panel/dominio/catalogo'
import { crearLecturaDePlanes } from '@/panel/infraestructura/lectura-de-planes-payload'
import { exigirSesion, rolDeLaSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Filas de la tabla' }

// Filas de la tabla «Nuestros planes» (maqueta «Planes › Filas de la tabla»). Las lecturas usan la
// Local API con los permisos de quien entra; solo el administrador ve «Eliminar» (y la acción lo
// vuelve a comprobar).
export default async function PaginaDeLasFilas() {
  const sesion = await exigirSesion()
  const datos = await obtenerFilasDeLaTabla(crearLecturaDePlanes(sesion))
  // `key`: tras guardar, el servidor devuelve las filas con sus ids nuevos y el formulario
  // empieza de nuevo desde lo guardado.
  const firma = datos.caracteristicas.map((c) => `${c.id}:${c.nombre}`).join('|')
  return (
    <PantallaDeFilas
      key={firma}
      datos={datos}
      puedeQuitar={puedeEliminarDelCatalogo(rolDeLaSesion(sesion))}
    />
  )
}
