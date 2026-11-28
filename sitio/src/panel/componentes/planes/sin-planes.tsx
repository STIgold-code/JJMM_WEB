import { Layers } from 'lucide-react'

// Estado vacío: todavía no hay planes. La tabla «Nuestros planes» del inicio no se muestra.
export function SinPlanes() {
  return (
    <div className="mx-auto grid max-w-[30rem] justify-items-center gap-[0.6rem] px-6 py-12 text-center">
      <span className="mb-1 grid size-12 place-items-center rounded-full bg-accent text-primary">
        <Layers aria-hidden="true" strokeWidth={1.75} className="size-[1.375rem]" />
      </span>
      <h2 className="text-[0.9375rem] font-[650]">Todavía no hay planes</h2>
      <p className="text-muted-foreground">
        Cada plan que crees aparecerá aquí como una columna de la tabla «Nuestros planes» del
        inicio. Mientras no haya ninguno visible, el sitio no muestra esa tabla.
      </p>
    </div>
  )
}
