import { BriefcaseBusiness, Plus } from 'lucide-react'

import { type AreaDelPanel, razonSinNuevaArea } from '../../dominio/areas-de-servicio'
import { EstadoVacio } from '../comunes/estado-vacio'
import { Button } from '../ui/button'
import { ListaDeAreas } from './lista-de-areas'

const ID_DE_LA_RAZON = 'razon-nueva-area'

// «Nueva área» se ve deshabilitado y dice por qué (las áreas son los gajos fijos de la rueda).
function Cabecera() {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          Áreas de servicio
        </h1>
        <p className="max-w-[60ch] text-muted-foreground">
          Las nueve áreas de la rueda SIGE Mype que muestra «Nuestros servicios» en el inicio. Este
          orden es el de las pestañas debajo de la rueda.
        </p>
      </div>
      <Button type="button" disabled aria-describedby={ID_DE_LA_RAZON}>
        <Plus aria-hidden="true" />
        Nueva área
      </Button>
    </div>
  )
}

// Pantalla «Áreas de servicio» (presentación): las áreas en el orden del sitio, ordenables. Todo
// llega ya leído con los permisos de quien entra.
export function PantallaDeAreas({ areas }: { areas: AreaDelPanel[] }) {
  return (
    <>
      <Cabecera />
      <section
        aria-label="Lista de áreas de servicio"
        className="rounded-lg border bg-card text-card-foreground shadow-sm"
      >
        {areas.length > 0 ? (
          <ListaDeAreas areas={areas} />
        ) : (
          <EstadoVacio
            Icono={BriefcaseBusiness}
            titulo="Todavía no hay áreas de servicio"
            texto="Aquí aparecen las nueve áreas de la rueda SIGE Mype (P1 a P9), con su pestaña y lo que incluye cada una."
          />
        )}
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
          <span id={ID_DE_LA_RAZON}>{razonSinNuevaArea(areas.length)}</span>
          {areas.length > 1 && (
            <span>Arrastra o usa las flechas para ordenar; el cambio se guarda solo.</span>
          )}
        </div>
      </section>
    </>
  )
}
