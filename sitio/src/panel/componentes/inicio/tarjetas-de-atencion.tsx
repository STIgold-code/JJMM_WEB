import type { TarjetaDeAtencion } from '../../dominio/atencion'
import { IconoDelPanel } from '../iconos/icono-del-panel'

// «Requiere atención»: cada tarjeta toma el color de «pendiente» solo si hay algo pendiente.
export function TarjetasDeAtencion({ tarjetas }: { tarjetas: TarjetaDeAtencion[] }) {
  if (tarjetas.length === 0) return null
  return (
    <section aria-labelledby="titulo-atencion">
      <h2 id="titulo-atencion" className="text-[1.0625rem] leading-[1.35] font-[650]">
        Requiere atención
      </h2>
      <div className="mt-3 grid gap-4 escritorio:grid-cols-3">
        {tarjetas.map((tarjeta) => (
          <a
            key={tarjeta.clave}
            href={tarjeta.href}
            data-pendiente={tarjeta.pendiente}
            className="group grid grid-cols-[auto_1fr] items-start gap-x-[0.85rem] gap-y-1 rounded-lg border bg-card px-[1.1rem] py-4 text-foreground no-underline shadow-sm transition-[border-color,box-shadow] duration-150 hover:border-[#bccbdc] hover:shadow-md data-[pendiente=true]:border-pendiente-borde data-[pendiente=true]:bg-pendiente-fondo"
          >
            <span className="row-span-2 grid size-10 place-items-center rounded-md bg-muted text-muted-foreground group-data-[pendiente=true]:bg-pendiente-solido group-data-[pendiente=true]:text-white">
              <IconoDelPanel nombre={tarjeta.icono} />
            </span>
            <strong className="text-2xl leading-[1.1] font-bold">{tarjeta.cantidad}</strong>
            <span className="text-sm text-muted-foreground group-data-[pendiente=true]:text-pendiente">
              {tarjeta.titulo}
            </span>
            <em className="col-start-2 mt-[0.4rem] text-[0.8125rem] font-semibold text-muted-foreground not-italic group-data-[pendiente=true]:text-pendiente">
              {tarjeta.detalle}
            </em>
          </a>
        ))}
      </div>
    </section>
  )
}
