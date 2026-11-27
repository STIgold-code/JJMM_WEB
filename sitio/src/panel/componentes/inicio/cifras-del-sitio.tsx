import type { Cifra } from '../../dominio/cifras'
import { IconoDelPanel } from '../iconos/icono-del-panel'
import { TarjetaDelPanel } from './tarjeta-del-panel'

// «Lo que publica hoy el sitio»: las líneas entre celdas son el fondo que asoma por el `gap`.
export function CifrasDelSitio({ cifras }: { cifras: Cifra[] }) {
  if (cifras.length === 0) return null
  return (
    <TarjetaDelPanel idDelTitulo="titulo-cifras" titulo="Lo que publica hoy el sitio">
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-b-lg bg-border sm:grid-cols-3 ancho:grid-cols-6">
        {cifras.map((cifra) => (
          <li
            key={cifra.clave}
            className="flex items-center gap-3 bg-card px-4 py-[0.85rem] sm:px-5 sm:py-4"
          >
            <span className="grid size-9 flex-none place-items-center rounded-md bg-accent text-primary">
              <IconoDelPanel nombre={cifra.icono} />
            </span>
            <a href={cifra.href} className="group grid leading-[1.25] text-foreground no-underline">
              <strong className="text-xl font-bold">{cifra.cantidad}</strong>
              <span className="text-[0.8125rem] text-muted-foreground group-hover:text-primary group-hover:underline">
                {cifra.etiqueta}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </TarjetaDelPanel>
  )
}
