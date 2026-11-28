import type { Metadata } from 'next'

import { PantallaDeClientes } from '@/panel/componentes/clientes/pantalla-de-clientes'
import { puedeEliminarDelCatalogo } from '@/panel/dominio/catalogo'
import { crearRepositorioDeClientes } from '@/panel/infraestructura/clientes-payload'
import { exigirSesion, rolDeLaSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Clientes' }

// Clientes del carrusel «Nuestros clientes». Las lecturas usan la Local API con los permisos de
// quien entra; el botón de borrar solo se muestra al administrador (y la acción lo vuelve a
// comprobar).
export default async function PaginaDeClientes() {
  const sesion = await exigirSesion()
  const clientes = await crearRepositorioDeClientes(sesion).listarClientes()
  return (
    <PantallaDeClientes
      clientes={clientes}
      puedeEliminar={puedeEliminarDelCatalogo(rolDeLaSesion(sesion))}
    />
  )
}
