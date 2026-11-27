'use server'

import { redirect } from 'next/navigation'

import { ingresar } from '../aplicacion/ingresar'
import type { EstadoDelFormularioDeIngreso } from '../dominio/ingreso'
import { RUTA_DEL_INICIO } from '../dominio/rutas-del-panel'
import { autenticarConPayload } from '../infraestructura/autenticacion-payload'

// Ingreso al panel (`useActionState`). Con credenciales válidas, Payload deja la cookie de
// sesión y se va al inicio; si no, vuelve un solo mensaje que no dice qué dato falló.
export async function ingresarAlPanel(
  _estadoPrevio: EstadoDelFormularioDeIngreso,
  datos: FormData,
): Promise<EstadoDelFormularioDeIngreso> {
  const correo = datos.get('correo')
  const resultado = await ingresar(correo, datos.get('clave'), autenticarConPayload)
  if (resultado.aceptado) redirect(RUTA_DEL_INICIO)
  return { error: resultado.error, correo: typeof correo === 'string' ? correo : '' }
}
