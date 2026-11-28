import type { Aviso } from './respuesta-al-mensaje'

// Avisos de la guía de clientes (cierre tributario, cierre de planilla…): cada uno visible sale
// en /guia, en el orden del panel.
export interface AvisoDelPanel {
  id: number
  titulo: string
  cuandoAplica: string
  documentos: string[]
  correo: string | null
  visible: boolean
  orden: number
}

const primerParrafo = (texto: string): string =>
  texto
    .trim()
    .split(/\n\s*\n/)[0]
    ?.trim() ?? ''

const documentos = (cantidad: number) =>
  `${cantidad} ${cantidad === 1 ? 'documento' : 'documentos'}`

// Dato secundario de la fila: «Inicia el 20 de cada mes. · 16 documentos».
export function secundarioDeAviso(
  aviso: Pick<AvisoDelPanel, 'cuandoAplica' | 'documentos' | 'correo'>,
): string {
  const partes = [primerParrafo(aviso.cuandoAplica), documentos(aviso.documentos.length)]
  if (!aviso.correo) partes.push('sin correo')
  return partes.join(' · ')
}

// Lo que se escribe en el panel lateral, como la maqueta: los documentos van uno por línea.
export interface FormularioDeAviso {
  titulo: string
  cuandoAplica: string
  documentos: string
  correo: string
}

export function formularioDeAviso(aviso: AvisoDelPanel | null): FormularioDeAviso {
  return {
    titulo: aviso?.titulo ?? '',
    cuandoAplica: aviso?.cuandoAplica ?? '',
    documentos: aviso?.documentos.join('\n') ?? '',
    correo: aviso?.correo ?? '',
  }
}

export function hayCambiosEnElAviso(original: FormularioDeAviso, actual: FormularioDeAviso) {
  return (Object.keys(original) as (keyof FormularioDeAviso)[]).some(
    (campo) => original[campo] !== actual[campo],
  )
}

// Avisos breves tras escribir.
export function avisoDeVisibilidadDeAviso(titulo: string, visible: boolean): Aviso {
  return {
    titulo: visible ? `«${titulo}» ya se ve en la guía` : `«${titulo}» quedó oculto en la guía`,
    detalle: 'Puedes cambiarlo cuando quieras.',
  }
}

export function avisoDeAvisoGuardado(visible: boolean): Aviso {
  return {
    titulo: 'Cambios guardados',
    detalle: visible
      ? 'La guía de clientes ya muestra los cambios.'
      : 'El aviso está oculto: enciende «Visible» en la lista para mostrarlo en la guía.',
  }
}

export function avisoDeAvisoCreado(titulo: string): Aviso {
  return {
    titulo: `«${titulo}» creado`,
    detalle: 'Quedó oculto y al final: enciende «Visible» en la lista cuando esté listo.',
  }
}

export function avisoDeAvisoEliminado(titulo: string): Aviso {
  return { titulo: 'Aviso eliminado', detalle: `Se borró «${titulo}».` }
}
