import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'

interface Props {
  // Enlace «volver» a la lista de la sección.
  volverA: { ruta: string; texto: string }
  titulo: string
  bajada: string
  // Antes del título, por ejemplo el código de un área.
  prefijo?: ReactNode
  // A la derecha, por ejemplo «Nuevo valor».
  accion?: ReactNode
}

function Textos({ volverA, titulo, bajada, prefijo }: Omit<Props, 'accion'>) {
  return (
    <>
      <Link
        href={volverA.ruta}
        className="inline-flex w-fit items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-primary hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        {volverA.texto}
      </Link>
      <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance [overflow-wrap:anywhere] max-sm:text-2xl">
        {prefijo}
        {titulo}
      </h1>
      <p className="max-w-[60ch] text-muted-foreground">{bajada}</p>
    </>
  )
}

// Cabecera de una página de edición: «volver» a la sección, el título (lo que se está
// escribiendo) y qué se edita ahí; con una acción, esta va a la derecha.
export function CabeceraDeEdicion({ accion, ...textos }: Props) {
  if (!accion)
    return (
      <div className="mb-6 grid gap-1">
        <Textos {...textos} />
      </div>
    )
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <Textos {...textos} />
      </div>
      {accion}
    </div>
  )
}
