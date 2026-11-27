import { type EnlaceDeContacto, enlaceDeCorreo } from '@/compartido/dominio/enlaces-de-contacto'

// Aviso de la guía de clientes tal como se guarda en el panel: texto, no imagen (S7).
export interface AvisoGuardado {
  titulo: string
  cuandoAplica: string
  documentos: readonly string[]
  correoDeContacto: string | null
}

export interface AvisoPublico {
  titulo: string
  // «Cuándo aplica» separado en párrafos.
  parrafos: string[]
  documentos: readonly string[]
  correo: EnlaceDeContacto | null
}

const LINEA_EN_BLANCO = /\n\s*\n/

function enParrafos(texto: string): string[] {
  return texto
    .split(LINEA_EN_BLANCO)
    .map((parrafo) => parrafo.trim())
    .filter((parrafo) => parrafo.length > 0)
}

export function prepararAviso(aviso: AvisoGuardado): AvisoPublico {
  return {
    titulo: aviso.titulo,
    parrafos: enParrafos(aviso.cuandoAplica),
    documentos: aviso.documentos,
    correo: aviso.correoDeContacto ? enlaceDeCorreo(aviso.correoDeContacto) : null,
  }
}
