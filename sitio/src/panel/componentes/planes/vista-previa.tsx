import { cn } from 'cn'
import { Check, Eye } from 'lucide-react'

import type { CeldaDePlan } from '@/modulos/planes/dominio/matriz-de-planes'

import type { TextosDeLaSeccion } from '../../aplicacion/consultar-planes'
import type { VistaPreviaDePlanes } from '../../dominio/vista-previa-de-planes'

// Colores del sitio público (tokens v4), solo para que la vista previa se parezca a él.
function Celda({ celda }: { celda: CeldaDePlan }) {
  if (celda.tipo === 'texto') return <>{celda.texto}</>
  if (celda.tipo === 'incluido')
    return (
      <span
        role="img"
        aria-label="Incluido"
        className="inline-grid size-[1.1rem] place-items-center rounded-full bg-[#1d629c] text-white"
      >
        <Check aria-hidden="true" strokeWidth={3} className="size-[0.7rem]" />
      </span>
    )
  return (
    <span role="img" aria-label="No incluido" className="text-[#66768c]">
      —
    </span>
  )
}

const CELDA =
  'border-b border-[#dbe3ec] px-[0.4rem] py-[0.35rem] text-center align-middle [overflow-wrap:anywhere] hyphens-auto'
const ENCABEZADO =
  'px-[0.3rem] py-[0.55rem] text-center align-middle font-marca text-[0.8rem] leading-[1.15] font-medium text-white [overflow-wrap:anywhere] hyphens-auto'

// Fondo de una celda: la columna del plan editado resaltada; las demás, con filas alternas.
const fondo = (editado: boolean, filaPar: boolean) =>
  editado ? 'bg-[#eaf1f8]' : filaPar ? 'bg-[#f7f9fc]' : undefined

function Encabezados({ vista, encabezado }: { vista: VistaPreviaDePlanes; encabezado: string }) {
  return (
    <thead>
      <tr>
        <th scope="col" className={cn(ENCABEZADO, 'w-[40%] bg-[#0f3354] text-left')}>
          {encabezado}
        </th>
        {vista.columnas.map((columna, indice) => (
          <th
            key={indice}
            scope="col"
            className={cn(
              ENCABEZADO,
              columna.editado ? 'bg-[#1d629c] shadow-[inset_0_-3px_0_#feee00]' : 'bg-[#0f3354]',
            )}
          >
            {columna.nombre}
          </th>
        ))}
      </tr>
    </thead>
  )
}

function Tabla({ vista, encabezado }: { vista: VistaPreviaDePlanes; encabezado: string }) {
  const editado = (indice: number) => vista.columnas[indice]?.editado ?? false
  return (
    <table className="w-full table-fixed border-collapse">
      <caption className="sr-only">Vista previa de la tabla de planes</caption>
      <Encabezados vista={vista} encabezado={encabezado} />
      <tbody>
        {vista.filas.map((fila, indiceDeFila) => (
          <tr key={indiceDeFila}>
            <td className={cn(CELDA, 'text-left', fondo(false, indiceDeFila % 2 === 1))}>
              {fila.caracteristica}
            </td>
            {fila.celdas.map((celda, indice) => (
              <td
                key={indice}
                className={cn(CELDA, fondo(editado(indice), indiceDeFila % 2 === 1))}
              >
                <Celda celda={celda} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

interface Props {
  vista: VistaPreviaDePlanes
  textos: TextosDeLaSeccion
}

// Vista previa de «Nuestros planes» con lo que se está escribiendo, con la columna del plan
// resaltada. Es una versión del panel: la tabla del sitio depende de su CSS y de su sprite de
// íconos, que el panel no carga.
export function VistaPrevia({ vista, textos }: Props) {
  const conColumnas = vista.columnas.length > 0
  return (
    <aside
      aria-labelledby="titulo-vista"
      className="overflow-hidden rounded-lg border bg-card amplio:sticky amplio:top-[calc(var(--alto-barra)+1.25rem)]"
    >
      <div className="flex items-center justify-between gap-2 border-b bg-muted px-[0.9rem] py-[0.55rem] text-[0.8125rem] font-semibold text-muted-foreground">
        <span id="titulo-vista">Vista previa: «{textos.titulo}» en el sitio</span>
        <Eye aria-hidden="true" className="size-4 shrink-0" />
      </div>
      <div className="overflow-x-auto bg-white px-4 py-5 text-xs text-[#1f2d3d] amplio:max-h-[calc(100vh-var(--alto-barra)-5rem)] amplio:overflow-y-auto">
        <p className="mb-1 text-center font-marca text-[1.35rem] font-medium text-[#0f3354] uppercase">
          {textos.titulo}
        </p>
        {textos.bajada && (
          <p className="mx-auto mb-4 max-w-[28rem] text-center text-[#4b5b6d]">{textos.bajada}</p>
        )}
        {vista.planOculto && (
          <p className="mb-3 rounded-md border border-pendiente-borde bg-pendiente-fondo px-3 py-2 text-[0.8125rem] text-pendiente">
            Este plan está oculto: su columna no aparece en el sitio.
          </p>
        )}
        {conColumnas ? (
          <Tabla vista={vista} encabezado={textos.encabezado} />
        ) : (
          <p className="py-6 text-center text-[#4b5b6d]">
            Ningún plan está visible: el sitio no muestra esta tabla.
          </p>
        )}
        <p className="mt-3 text-center text-[#4b5b6d]">
          {textos.notaAlPie && <>{textos.notaAlPie} </>}
          <span className="inline-block rounded-sm bg-[#feee00] px-[0.7rem] py-[0.3rem] font-bold text-[#0f3354]">
            {textos.textoDelBoton}
          </span>
        </p>
      </div>
    </aside>
  )
}
