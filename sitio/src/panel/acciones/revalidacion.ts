import { revalidatePath } from 'next/cache'

import { RUTA_DEL_INICIO } from '../dominio/rutas-del-panel'

// Tras una escritura que salió bien se revalida todo el panel (listados, contadores del menú e
// inicio). La caché del sitio público la invalidan los hooks de cada colección, que corren dentro
// de Next. No es una acción de servidor: la importan las acciones.
export async function conRevalidacion<T>(
  escribir: Promise<T>,
  escribio: (resultado: T) => boolean,
): Promise<T> {
  const resultado = await escribir
  if (escribio(resultado)) revalidatePath(RUTA_DEL_INICIO, 'layout')
  return resultado
}

export const salioBien = (resultado: { ok: boolean }): boolean => resultado.ok

export const seGuardo = (resultado: { estado: string }): boolean => resultado.estado === 'guardado'
