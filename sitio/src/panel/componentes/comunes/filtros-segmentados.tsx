'use client'

export interface OpcionSegmentada<V extends string> {
  valor: V
  texto: string
  // Sin cantidad, el botón no lleva contador (por ejemplo, un selector de periodicidad).
  cantidad?: number
}

type Props<V extends string> = {
  opciones: readonly OpcionSegmentada<V>[]
  actual: V
  alElegir: (valor: V) => void
  className?: string
} & ({ 'aria-label': string } | { 'aria-labelledby': string })

const BOTON =
  'group inline-flex min-h-8 items-center gap-[0.4rem] rounded-sm px-3 py-1 text-[0.8125rem] font-semibold text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-pressed:bg-card aria-pressed:text-foreground aria-pressed:shadow-sm max-sm:flex-1 max-sm:justify-center max-sm:px-2'

// Control segmentado de la maqueta: botones con `aria-pressed` dentro de un grupo con nombre,
// como los filtros de mensajes y de cuentas.
export function FiltrosSegmentados<V extends string>(props: Props<V>) {
  const { opciones, actual, alElegir, className, ...nombre } = props
  return (
    <div
      role="group"
      {...nombre}
      className={`inline-flex flex-wrap gap-[0.2rem] rounded-md bg-muted p-[0.2rem] max-sm:flex max-sm:w-full ${className ?? ''}`}
    >
      {opciones.map(({ valor, texto, cantidad }) => (
        <button
          key={valor}
          type="button"
          aria-pressed={valor === actual}
          onClick={() => alElegir(valor)}
          className={BOTON}
        >
          {texto}
          {cantidad !== undefined && (
            <span className="min-w-[1.3rem] rounded-full bg-foreground/8 px-[0.3rem] text-center text-xs leading-[1.3rem] group-aria-pressed:bg-accent group-aria-pressed:text-accent-foreground">
              {cantidad}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
