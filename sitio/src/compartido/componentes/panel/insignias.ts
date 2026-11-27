// Insignias de estado que se leen de un vistazo en las listas y en el inicio del panel.
export type TonoDeInsignia = 'atencion' | 'positivo' | 'neutro'

export interface DatosDeInsignia {
  texto: string
  tono: TonoDeInsignia
}

const ESTADOS_DE_MENSAJE: Readonly<Record<string, DatosDeInsignia>> = {
  nuevo: { texto: 'Nuevo', tono: 'atencion' },
  atendido: { texto: 'Atendido', tono: 'neutro' },
}

export function insigniaDeMensaje(valor: unknown): DatosDeInsignia | null {
  return typeof valor === 'string' ? (ESTADOS_DE_MENSAJE[valor] ?? null) : null
}

// Campo «Activa» / «Visible» (`campoActivo`): si se muestra en el sitio.
export function insigniaDeActivo(valor: unknown): DatosDeInsignia {
  return valor === true
    ? { texto: 'Se muestra', tono: 'positivo' }
    : { texto: 'Oculto', tono: 'neutro' }
}
