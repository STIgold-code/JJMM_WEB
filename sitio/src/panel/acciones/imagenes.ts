'use server'

import { buscarImagenesParaElegir, type PaginaParaElegir } from '../aplicacion/elegir-imagenes'
import {
  type ErroresDeImagen,
  eliminarImagen,
  guardarTextoAlternativo,
} from '../aplicacion/gestionar-imagenes'
import type {
  EstadoDelGuardado,
  ResultadoDeAccionRapida,
} from '../aplicacion/resultados-de-escritura'
import { crearRepositorioDeImagenes } from '../infraestructura/imagenes-payload'
import { exigirSesion, rolDeLaSesion } from '../infraestructura/sesion-del-panel'
import { conRevalidacion, salioBien, seGuardo } from './revalidacion'

// Acciones de la biblioteca de imágenes. Cada una exige la sesión primero (sin ella, `redirect`
// corta antes de tocar Payload), valida en el servidor lo que llega del navegador y usa los
// permisos de la cuenta. La subida de archivos no es una acción: ver `subida-de-imagenes.ts`.
export async function guardarElTextoAlternativo(
  id: unknown,
  formulario: unknown,
): Promise<EstadoDelGuardado<ErroresDeImagen>> {
  const sesion = await exigirSesion()
  const repositorio = crearRepositorioDeImagenes(sesion)
  return conRevalidacion(guardarTextoAlternativo(repositorio, { id, formulario }), seGuardo)
}

// Solo el administrador, y nunca una imagen en uso.
export async function eliminarLaImagen(id: unknown): Promise<ResultadoDeAccionRapida> {
  const sesion = await exigirSesion()
  const entrada = { id, rol: rolDeLaSesion(sesion) }
  return conRevalidacion(eliminarImagen(crearRepositorioDeImagenes(sesion), entrada), salioBien)
}

// Lectura para «Elegir de Imágenes» del selector (no escribe nada).
export async function listarImagenesParaElegir(
  busqueda: unknown,
  pagina: unknown,
): Promise<PaginaParaElegir> {
  const sesion = await exigirSesion()
  return buscarImagenesParaElegir(crearRepositorioDeImagenes(sesion), { busqueda, pagina })
}
