import { Plus } from 'lucide-react'
import Link from 'next/link'

import { RUTA_DE_NUEVA_SEDE, type SedeDelPanel } from '../../dominio/sedes'
import { Button } from '../ui/button'
import { ListaDeSedes } from './lista-de-sedes'
import { SinSedes } from './sin-sedes'

const plural = (cantidad: number) => `${cantidad} ${cantidad === 1 ? 'sede' : 'sedes'}`

function Cabecera() {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          Sedes
        </h1>
        <p className="max-w-[60ch] text-muted-foreground">
          Cada sede visible aparece en el pie del sitio y como una pestaña de «Contáctanos». Apágala
          para ocultarla sin borrarla.
        </p>
      </div>
      <Button asChild className="hover:bg-primary-hover max-sm:w-full">
        <Link href={RUTA_DE_NUEVA_SEDE}>
          <Plus aria-hidden="true" />
          Nueva sede
        </Link>
      </Button>
    </div>
  )
}

// Pantalla «Sedes» (presentación): cabecera con «Nueva sede» y el listado en el orden de las
// pestañas de «Contáctanos». Todo llega ya leído con los permisos de quien entra.
export function PantallaDeSedes({ sedes }: { sedes: SedeDelPanel[] }) {
  return (
    <>
      <Cabecera />
      <section
        aria-label="Lista de sedes"
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        {sedes.length > 0 ? <ListaDeSedes sedes={sedes} /> : <SinSedes />}
        {sedes.length > 0 && (
          <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
            <span>{plural(sedes.length)} · el orden es el de las pestañas de «Contáctanos»</span>
            <span>Arrastra o usa las flechas para ordenar; el cambio se guarda solo.</span>
          </div>
        )}
      </section>
    </>
  )
}
