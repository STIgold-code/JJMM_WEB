import type { Metadata } from 'next'

import { obtenerValores } from '@/panel/aplicacion/consultar-valores'
import { ValoresConVistaPrevia } from '@/panel/componentes/valores/valores-con-vista-previa'
import { puedeEliminarDelCatalogo } from '@/panel/dominio/catalogo'
import { exigirSesion, rolDeLaSesion } from '@/panel/infraestructura/sesion-del-panel'
import { crearRepositorioDeValores } from '@/panel/infraestructura/valores-payload'

export const metadata: Metadata = { title: 'Valores' }

// Valores de «¿Por qué elegirnos?»: se llega desde «Página de inicio» (L14), sin entrada propia en
// el menú. Las lecturas usan la Local API con los permisos de quien entra; el botón de borrar solo
// se muestra al administrador (y la acción lo vuelve a comprobar).
export default async function PaginaDeValores() {
  const sesion = await exigirSesion()
  const datos = await obtenerValores(crearRepositorioDeValores(sesion))
  return (
    <ValoresConVistaPrevia
      datos={datos}
      puedeEliminar={puedeEliminarDelCatalogo(rolDeLaSesion(sesion))}
    />
  )
}
