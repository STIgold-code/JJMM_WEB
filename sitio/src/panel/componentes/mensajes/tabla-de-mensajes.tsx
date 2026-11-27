import Link from 'next/link'

import type { MensajeDeContacto } from '../../aplicacion/consultar-mensajes'
import { fechaRelativa } from '../../dominio/fechas-del-panel'
import { extractoDelMensaje } from '../../dominio/lista-de-mensajes'
import { type ConsultaDeMensajes, rutaDeMensajes } from '../../dominio/mensajes'
import { iniciales } from '../../dominio/menu-del-panel'
import { idDeFila } from './ids-de-mensajes'
import { InsigniaDeEstado } from './insignia-de-estado'

const CELDA = 'px-4 py-[0.7rem] max-sm:p-0'

interface PropsDeFila {
  mensaje: MensajeDeContacto
  consulta: ConsultaDeMensajes
  ahora: Date
}

// La fila entera abre el mensaje: el enlace del nombre es el control accesible y su `::after`
// cubre la fila. En celulares la fila se apila (nombre y estado arriba, fecha abajo).
function Fila({ mensaje, consulta, ahora }: PropsDeFila) {
  return (
    <tr className="relative border-b transition-colors last:border-b-0 hover:bg-[#f8fafd] max-sm:grid max-sm:grid-cols-[minmax(0,1fr)_auto] max-sm:gap-x-3 max-sm:gap-y-[0.35rem] max-sm:px-4 max-sm:py-[0.85rem]">
      <td className={CELDA}>
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-8 flex-none place-items-center rounded-full bg-accent text-xs font-bold text-accent-foreground"
          >
            {iniciales(mensaje.nombre, mensaje.nombre)}
          </span>
          <div className="grid min-w-0 leading-[1.35]">
            <Link
              id={idDeFila(mensaje.id)}
              href={rutaDeMensajes({ ...consulta, mensaje: mensaje.id })}
              scroll={false}
              className="truncate font-[650] text-foreground after:absolute after:inset-0 hover:text-primary hover:underline"
            >
              {mensaje.nombre}
            </Link>
            <span className="truncate text-[0.8125rem] text-muted-foreground">
              {extractoDelMensaje(mensaje.mensaje)}
            </span>
          </div>
        </div>
      </td>
      <td className={`${CELDA} max-sm:hidden`}>
        {mensaje.servicio ?? <span className="text-muted-foreground">Sin indicar</span>}
      </td>
      <td className={`${CELDA} max-sm:col-start-2 max-sm:row-start-1 max-sm:self-center`}>
        <InsigniaDeEstado estado={mensaje.estado} />
      </td>
      <td className={`${CELDA} whitespace-nowrap text-muted-foreground max-sm:col-span-full`}>
        <time dateTime={mensaje.recibido}>{fechaRelativa(new Date(mensaje.recibido), ahora)}</time>
      </td>
    </tr>
  )
}

interface Props {
  mensajes: MensajeDeContacto[]
  consulta: ConsultaDeMensajes
  ahora: Date
  textoVacio: string
}

export function TablaDeMensajes({ mensajes, consulta, ahora, textoVacio }: Props) {
  return (
    <table className="w-full border-collapse text-sm max-sm:block">
      <thead className="max-sm:hidden">
        <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
          <th scope="col" className="px-4 py-[0.6rem] font-semibold">
            Persona y mensaje
          </th>
          <th scope="col" className="px-4 py-[0.6rem] font-semibold">
            Servicio de interés
          </th>
          <th scope="col" className="px-4 py-[0.6rem] font-semibold">
            Estado
          </th>
          <th scope="col" className="px-4 py-[0.6rem] font-semibold">
            Recibido
          </th>
        </tr>
      </thead>
      <tbody className="max-sm:block">
        {mensajes.map((mensaje) => (
          <Fila key={mensaje.id} mensaje={mensaje} consulta={consulta} ahora={ahora} />
        ))}
        {mensajes.length === 0 && (
          <tr className="max-sm:block">
            <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground max-sm:block">
              {textoVacio}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
