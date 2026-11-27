import { type Faltante, porcentaje } from '../../dominio/faltantes'
import { BarraDeAvance } from './barra-de-avance'
import { TarjetaDelPanel } from './tarjeta-del-panel'

// «Lo que falta completar», con el avance de cada dato. Lo completo se pinta de «listo».
export function ListaDeFaltantes({ faltantes }: { faltantes: Faltante[] }) {
  if (faltantes.length === 0) return null
  return (
    <TarjetaDelPanel
      id="lo-que-falta"
      idDelTitulo="titulo-falta"
      titulo="Lo que falta completar"
      bajada="Datos que el sitio necesita o que el estudio debe confirmar."
    >
      <ul className="grid">
        {faltantes.map((faltante) => (
          <li
            key={faltante.clave}
            className="grid gap-[0.35rem] border-b px-5 py-[0.85rem] last:border-b-0"
          >
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <a
                href={faltante.href}
                className="font-semibold text-foreground no-underline hover:text-primary hover:underline"
              >
                {faltante.texto}
              </a>
              <span className="flex-none text-[0.8125rem] text-muted-foreground">
                {faltante.etiqueta}
              </span>
            </div>
            <BarraDeAvance
              porcentaje={porcentaje(faltante.actual, faltante.total)}
              etiqueta={faltante.etiqueta}
              descripcion={faltante.texto}
              completo={faltante.completo}
            />
          </li>
        ))}
      </ul>
    </TarjetaDelPanel>
  )
}
