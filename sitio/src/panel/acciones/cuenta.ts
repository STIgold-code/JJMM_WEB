'use server'

import { revalidatePath } from 'next/cache'

import {
  cambiarMiClave,
  type EstadoDeMiNombre,
  type EstadoDelCambioDeClave,
  guardarMiNombre,
} from '../aplicacion/mi-cuenta'
import { RUTA_DEL_INICIO } from '../dominio/rutas-del-panel'
import { crearRepositorioDeMiCuenta } from '../infraestructura/mi-cuenta-payload'
import { exigirSesion } from '../infraestructura/sesion-del-panel'

// Escrituras de «Mi cuenta», para cualquier cuenta del equipo y solo sobre la propia: la cuenta
// sale de la sesión del servidor, nunca del formulario. Sin sesión, `exigirSesion` redirige al
// ingreso antes de tocar Payload.
export async function guardarElNombrePropio(formulario: unknown): Promise<EstadoDeMiNombre> {
  const sesion = await exigirSesion()
  const estado = await guardarMiNombre(crearRepositorioDeMiCuenta(sesion), formulario)
  // El nombre se ve en el menú lateral de todas las pantallas.
  if (estado.estado === 'guardado') revalidatePath(RUTA_DEL_INICIO, 'layout')
  return estado
}

// La contraseña nunca vuelve en la respuesta: solo el resultado y, si falló, el error del campo.
export async function cambiarLaContrasenaPropia(
  formulario: unknown,
): Promise<EstadoDelCambioDeClave> {
  const sesion = await exigirSesion()
  return cambiarMiClave(crearRepositorioDeMiCuenta(sesion), formulario)
}
