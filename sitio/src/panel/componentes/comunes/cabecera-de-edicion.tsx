import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface Props {
  // Enlace «volver» a la lista de la sección.
  volverA: { ruta: string; texto: string }
  titulo: string
  bajada: string
}

// Cabecera de una página de edición: «volver» a la sección, el título (lo que se está
// escribiendo) y qué se edita ahí.
export function CabeceraDeEdicion({ volverA, titulo, bajada }: Props) {
  return (
    <div className="mb-6 grid gap-1">
      <Link
        href={volverA.ruta}
        className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        {volverA.texto}
      </Link>
      <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance [overflow-wrap:anywhere] max-sm:text-2xl">
        {titulo}
      </h1>
      <p className="max-w-[60ch] text-muted-foreground">{bajada}</p>
    </div>
  )
}
