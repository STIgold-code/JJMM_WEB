import { ChevronRight, CircleCheck } from 'lucide-react'

import { fechaRelativa } from '../../dominio/fechas-del-panel'
import type { FilaPendiente } from '../../dominio/pendientes'
import { listaEnAdmin } from '../../dominio/rutas-del-panel'
import { Button } from '../ui/button'
import { TarjetaDelPanel } from './tarjeta-del-panel'

function TodoAlDia() {
  return (
    <div className="mx-auto grid max-w-[30rem] justify-items-center gap-[0.6rem] px-6 py-12 text-center">
      <span className="mb-1 grid size-12 place-items-center rounded-full bg-accent text-primary">
        <CircleCheck aria-hidden="true" strokeWidth={1.75} className="size-[1.375rem]" />
      </span>
      <h3 className="text-[0.9375rem] font-[650]">Todo al día</h3>
      <p className="text-muted-foreground">
        Aquí aparecen los mensajes nuevos del formulario «Contáctanos» y los borradores del blog que
        esperan publicarse.
      </p>
    </div>
  )
}

function Fila({ fila, ahora }: { fila: FilaPendiente; ahora: Date }) {
  return (
    <tr className="border-b last:border-b-0">
      <td className="px-4 py-[0.7rem]">
        <div className="grid min-w-0 leading-[1.35]">
          <strong className="truncate font-[650]">{fila.titulo}</strong>
          <span className="text-[0.8125rem] text-muted-foreground">{fila.detalle}</span>
        </div>
      </td>
      <td className="px-4 py-[0.7rem] max-sm:hidden">{fila.tipo}</td>
      <td className="px-4 py-[0.7rem] whitespace-nowrap text-muted-foreground">
        <time dateTime={fila.fecha}>{fechaRelativa(new Date(fila.fecha), ahora)}</time>
      </td>
      <td className="px-4 py-[0.7rem] text-right">
        <Button asChild variant="outline" size="sm" className="bg-card">
          <a href={fila.href} aria-label={fila.etiquetaDeAccion}>
            Ver
          </a>
        </Button>
      </td>
    </tr>
  )
}

interface PropsDeTabla {
  filas: FilaPendiente[]
  ahora: Date
}

function Tabla({ filas, ahora }: PropsDeTabla) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
            <th scope="col" className="px-4 py-[0.6rem] font-semibold">
              Qué
            </th>
            <th scope="col" className="px-4 py-[0.6rem] font-semibold max-sm:hidden">
              Tipo
            </th>
            <th scope="col" className="px-4 py-[0.6rem] font-semibold">
              Recibido
            </th>
            <th scope="col" className="px-4 py-[0.6rem]">
              <span className="sr-only">Acción</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <Fila key={fila.clave} fila={fila} ahora={ahora} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

// «Ver» abre el documento en /admin hasta que existan esas pantallas en el panel (fases 2 y 3).
export function TablaDePendientes({ filas, ahora }: PropsDeTabla) {
  const enlaceDeMensajes = (
    <Button asChild variant="ghost" size="sm">
      <a href={listaEnAdmin('mensajes-de-contacto')}>
        Ver todos los mensajes
        <ChevronRight aria-hidden="true" />
      </a>
    </Button>
  )
  return (
    <TarjetaDelPanel
      idDelTitulo="titulo-pendientes"
      titulo="Pendientes"
      bajada="Lo que espera una respuesta o una revisión, lo más reciente primero."
      accion={enlaceDeMensajes}
    >
      {filas.length === 0 ? <TodoAlDia /> : <Tabla filas={filas} ahora={ahora} />}
    </TarjetaDelPanel>
  )
}
