import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { PantallaDeIngreso } from '@/panel/componentes/ingreso/pantalla-de-ingreso'
import { RUTA_DEL_INICIO } from '@/panel/dominio/rutas-del-panel'
import { obtenerSesion } from '@/panel/infraestructura/sesion-del-panel'

export const metadata: Metadata = {
  title: { absolute: 'Ingresa al panel · Estudio Contable JJMM' },
}

// Única página del panel que no exige sesión. Con una sesión válida, va directo al inicio.
export default async function PaginaDeIngreso() {
  if (await obtenerSesion()) redirect(RUTA_DEL_INICIO)
  return <PantallaDeIngreso />
}
