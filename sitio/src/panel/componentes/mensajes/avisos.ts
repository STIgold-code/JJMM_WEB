import { toast } from 'sonner'

import type { Aviso } from '../../dominio/respuesta-al-mensaje'

// Avisos breves (Sonner) tras una escritura: éxito con su detalle o el error tal cual llega.
export function avisarExito({ titulo, detalle }: Aviso): void {
  toast.success(titulo, detalle ? { description: detalle } : undefined)
}

export function avisarError(error: string): void {
  toast.error(error)
}

export function avisarResultado(
  resultado: { ok: true; aviso: Aviso } | { ok: false; error: string },
): void {
  if (resultado.ok) avisarExito(resultado.aviso)
  else avisarError(resultado.error)
}
