import { List } from 'lucide-react'
import Link from 'next/link'

import type { DatosDelListadoDePlanes } from '../../aplicacion/consultar-planes'
import { RUTA_DE_FILAS_DE_LA_TABLA } from '../../dominio/planes'
import { Button } from '../ui/button'
import { DialogoNuevoPlan } from './dialogo-nuevo-plan'
import { ListaDePlanes } from './lista-de-planes'
import { SinPlanes } from './sin-planes'

const plural = (cantidad: number, singular: string, varios: string) =>
  `${cantidad} ${cantidad === 1 ? singular : varios}`

// Cabecera con «Filas de la tabla» (las características, comunes a todos los planes) y «Nuevo
// plan», como en la maqueta.
function Cabecera() {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          Planes
        </h1>
        <p className="max-w-[60ch] text-muted-foreground">
          Las columnas de la tabla «Nuestros planes» del inicio, en este orden. Nunca se publican
          montos: el sitio muestra «Consultar».
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline" className="bg-card">
          <Link href={RUTA_DE_FILAS_DE_LA_TABLA}>
            <List aria-hidden="true" />
            Filas de la tabla
          </Link>
        </Button>
        <DialogoNuevoPlan />
      </div>
    </div>
  )
}

function Pie({ planes, caracteristicas }: { planes: number; caracteristicas: number }) {
  return (
    <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
      <span>
        {plural(planes, 'plan', 'planes')} ·{' '}
        <Link
          href={RUTA_DE_FILAS_DE_LA_TABLA}
          className="text-primary underline-offset-2 hover:underline"
        >
          {plural(caracteristicas, 'fila de características', 'filas de características')}
        </Link>
      </span>
      <span>Arrastra o usa las flechas para ordenar; el cambio se guarda solo.</span>
    </div>
  )
}

// Pantalla «Planes» (presentación): cabecera con «Nuevo plan» y el listado en el orden de la
// tabla del sitio. Todo llega ya leído con los permisos de quien entra.
export function PantallaDePlanes({ datos }: { datos: DatosDelListadoDePlanes }) {
  const { planes, caracteristicas } = datos
  return (
    <>
      <Cabecera />
      <section
        aria-label="Lista de planes"
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        {planes.length > 0 ? (
          <ListaDePlanes planes={planes} caracteristicas={caracteristicas} />
        ) : (
          <SinPlanes />
        )}
        {planes.length > 0 && <Pie planes={planes.length} caracteristicas={caracteristicas} />}
      </section>
    </>
  )
}
