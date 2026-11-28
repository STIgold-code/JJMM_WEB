import type { Metadata } from 'next'

import { obtenerGuiaDeClientes } from '@/panel/aplicacion/consultar-guia'
import { PantallaDeLaGuia } from '@/panel/componentes/guia/pantalla-de-la-guia'
import { fechaIsoEnLima } from '@/panel/dominio/fechas-del-panel'
import { puedeEliminarEnLaGuia } from '@/panel/dominio/guia-de-clientes'
import { crearLecturaDeLaGuia } from '@/panel/infraestructura/lectura-de-la-guia-payload'
import { exigirSesion, rolDeLaSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = { title: 'Guía de clientes' }

// Guía de clientes: avisos, vencimientos y cronograma de SUNAT en una sola pantalla (L4 f). Las
// lecturas usan la Local API con los permisos de quien entra; el botón de borrar solo se muestra
// al administrador (y cada acción lo vuelve a comprobar).
export default async function PaginaDeLaGuia() {
  const sesion = await exigirSesion()
  const datos = await obtenerGuiaDeClientes(crearLecturaDeLaGuia(sesion))
  const anioActual = Number(fechaIsoEnLima(new Date()).slice(0, 4))
  return (
    <PantallaDeLaGuia
      {...datos}
      puedeEliminar={puedeEliminarEnLaGuia(rolDeLaSesion(sesion))}
      anioActual={anioActual}
    />
  )
}
