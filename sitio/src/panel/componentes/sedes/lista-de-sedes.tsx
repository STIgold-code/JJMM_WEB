'use client'

import { cambiarVisibilidadDeLaSede, ordenarLasSedes } from '../../acciones/sedes'
import { AVISO_DE_ULTIMA_VISIBLE, nombreCorto, type SedeDelPanel } from '../../dominio/sedes'
import { Confirmacion } from '../comunes/confirmacion'
import { useArrastre } from '../comunes/use-arrastre'
import { type AccionesDeLaLista, useListaOrdenable } from '../comunes/use-lista-ordenable'
import { FilaDeSede } from './fila-de-sede'
import { useOcultarConAviso } from './use-ocultar-con-aviso'

const ENCABEZADO = 'px-4 py-[0.6rem] font-semibold'

const ACCIONES: AccionesDeLaLista = {
  cambiarVisibilidad: cambiarVisibilidadDeLaSede,
  ordenar: ordenarLasSedes,
}

// En celulares la tabla se apila y el encabezado se oculta.
function Encabezado() {
  return (
    <thead className="max-sm:hidden">
      <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
        <th scope="col" className={`${ENCABEZADO} w-px`}>
          <span className="sr-only">Orden</span>
        </th>
        {['Sede', 'Celulares', 'En el sitio', 'Visible'].map((titulo) => (
          <th key={titulo} scope="col" className={ENCABEZADO}>
            {titulo}
          </th>
        ))}
        <th scope="col" className={ENCABEZADO}>
          <span className="sr-only">Acciones</span>
        </th>
      </tr>
    </thead>
  )
}

// Listado de sedes en el orden de las pestañas de «Contáctanos»: interruptor «Visible» y orden
// (asa para arrastrar, botones «Subir» y «Bajar»), los dos guardados al instante. Apagar la última
// sede visible pide confirmación.
export function ListaDeSedes({ sedes: delServidor }: { sedes: SedeDelPanel[] }) {
  const {
    elementos: sedes,
    anuncio,
    cambiarVisibilidad,
    mover,
  } = useListaOrdenable(delServidor, ACCIONES)
  const ocultar = useOcultarConAviso(sedes, cambiarVisibilidad)
  const { propsDeFila, propsDeAsa } = useArrastre((desde, hacia) => mover(desde, hacia))
  return (
    <>
      <table className="w-full border-collapse text-sm max-sm:block">
        <Encabezado />
        <tbody className="max-sm:block">
          {sedes.map((sede, indice) => (
            <FilaDeSede
              key={sede.id}
              sede={sede}
              indice={indice}
              total={sedes.length}
              alCambiarVisibilidad={ocultar.alCambiar}
              alMover={mover}
              propsDeFila={propsDeFila(indice)}
              propsDeAsa={propsDeAsa(indice)}
            />
          ))}
        </tbody>
      </table>
      <p aria-live="assertive" className="sr-only">
        {anuncio}
      </p>
      <ConfirmarOcultar {...ocultar} />
    </>
  )
}

function ConfirmarOcultar({
  porOcultar,
  confirmar,
  cancelar,
}: Omit<ReturnType<typeof useOcultarConAviso>, 'alCambiar'>) {
  return (
    <Confirmacion
      abierta={porOcultar !== null}
      titulo={`¿Ocultar la sede ${nombreCorto(porOcultar?.nombre ?? '')}?`}
      texto={`${AVISO_DE_ULTIMA_VISIBLE} Puedes volver a mostrarla cuando quieras.`}
      accion="Ocultar sede"
      alConfirmar={confirmar}
      alCerrar={cancelar}
    />
  )
}
