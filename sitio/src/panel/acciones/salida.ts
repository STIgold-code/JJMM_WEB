'use server'

import { redirect } from 'next/navigation'

import { RUTA_DE_INGRESO } from '../dominio/rutas-del-panel'
import { cerrarSesionEnPayload } from '../infraestructura/autenticacion-payload'
import { obtenerSesion } from '../infraestructura/sesion-del-panel'

// Cerrar sesión. Solo toca la sesión si existe una válida; sin ella no escribe nada y lleva
// igual al ingreso.
export async function salirDelPanel(): Promise<void> {
  const sesion = await obtenerSesion()
  if (sesion) await cerrarSesionEnPayload(sesion)
  redirect(RUTA_DE_INGRESO)
}
