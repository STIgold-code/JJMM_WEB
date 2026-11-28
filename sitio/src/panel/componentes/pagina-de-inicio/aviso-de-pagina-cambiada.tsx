'use client'

import { RefreshCw, TriangleAlert } from 'lucide-react'

import { ERROR_DESACTUALIZADA } from '../../dominio/pagina-de-inicio'
import { Button } from '../ui/button'

// Aviso fijo cuando el servidor no guardó porque otra persona cambió lo que se editaba mientras
// tanto (la página de inicio, las filas de la tabla): no basta un aviso breve, hay que recargar
// para ver lo último.
export function AvisoDePaginaCambiada({ texto = ERROR_DESACTUALIZADA }: { texto?: string }) {
  return (
    <div
      role="alert"
      className="mb-6 flex flex-wrap items-start gap-3 rounded-lg border border-error-borde bg-error-fondo px-4 py-3 text-sm text-error"
    >
      <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
      <p className="min-w-0 flex-1 basis-60">{texto}</p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="bg-card"
        onClick={() => window.location.reload()}
      >
        <RefreshCw aria-hidden="true" />
        Recargar la página
      </Button>
    </div>
  )
}
