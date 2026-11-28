'use client'

import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { migasDeRuta } from '../../dominio/migas-del-panel'

// Ruta de la barra superior. La última miga es la página actual.
export function RutaDeLaPagina() {
  const migas = migasDeRuta(usePathname())
  return (
    <nav aria-label="Ruta" className="min-w-0">
      <ol className="flex flex-wrap items-center gap-[0.35rem] text-sm text-muted-foreground">
        {migas.map((miga, indice) => (
          <li key={miga.texto} className="inline-flex min-w-0 items-center gap-[0.35rem]">
            {indice > 0 && <ChevronRight aria-hidden="true" className="size-3.5 opacity-70" />}
            {miga.ruta ? (
              <Link href={miga.ruta} className="hover:text-foreground hover:underline">
                {miga.texto}
              </Link>
            ) : (
              <span aria-current="page" className="truncate font-semibold text-foreground">
                {miga.texto}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
