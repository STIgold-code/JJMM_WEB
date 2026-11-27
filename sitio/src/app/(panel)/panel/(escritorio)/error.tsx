'use client'

import { CircleAlert, House, RotateCcw } from 'lucide-react'

import { Button } from '@/panel/componentes/ui/button'
import { RUTA_DEL_INICIO } from '@/panel/dominio/rutas-del-panel'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

// Red de seguridad de las pantallas con sesión: si algo falla al dibujar o al guardar, se ve
// esto dentro del panel (con su menú) en lugar de la página de error genérica de Next. Nunca
// muestra el mensaje ni la traza del error: pueden traer datos internos.
export default function ErrorDelPanel({ reset }: Props) {
  return (
    <section
      aria-labelledby="titulo-error-del-panel"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="mx-auto grid max-w-[30rem] justify-items-center gap-[0.6rem] px-6 py-12 text-center">
        <span className="mb-1 grid size-12 place-items-center rounded-full bg-error-fondo text-error">
          <CircleAlert aria-hidden="true" strokeWidth={1.75} className="size-[1.375rem]" />
        </span>
        <h1 id="titulo-error-del-panel" className="text-lg font-[650]">
          No pudimos mostrar esta pantalla
        </h1>
        <p className="text-muted-foreground">
          Ocurrió un problema al cargar o guardar los datos. Vuelve a intentarlo; si sigue pasando,
          avisa al administrador del panel.
        </p>
        <div className="mt-2 flex flex-wrap justify-center gap-2">
          <Button type="button" onClick={reset}>
            <RotateCcw aria-hidden="true" />
            Reintentar
          </Button>
          <Button asChild variant="outline" className="bg-card">
            <a href={RUTA_DEL_INICIO}>
              <House aria-hidden="true" />
              Ir al inicio
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
