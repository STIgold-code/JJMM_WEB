import { atenderSubidaDeImagen } from '@/panel/acciones/subida-de-imagenes'

// POST /panel/imagenes/subir: subida de una imagen desde el panel (ver `atenderSubidaDeImagen`).
// Solo POST: cualquier otro método responde 405.
export async function POST(request: Request): Promise<Response> {
  return atenderSubidaDeImagen(request)
}
