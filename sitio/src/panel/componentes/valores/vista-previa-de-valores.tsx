import type { TextosDePorQueElegirnos } from '../../aplicacion/consultar-valores'
import type { ValorDelPanel } from '../../dominio/valores'
import { MarcoDeVistaPrevia } from '../comunes/marco-de-vista-previa'
import { IconoDeValor } from './icono-de-valor'

interface Props {
  valores: readonly ValorDelPanel[]
  textos: TextosDePorQueElegirnos
}

// Vista previa de «¿Por qué elegirnos?» en el orden de la lista (versión del panel: la sección del
// sitio depende de su CSS y de su sprite).
export function VistaPreviaDeValores({ valores, textos }: Props) {
  return (
    <MarcoDeVistaPrevia titulo={`Vista previa: «${textos.titulo}» en el sitio`}>
      <p className="mb-1 text-center font-marca text-[1.35rem] font-medium text-[#0f3354] uppercase">
        {textos.titulo}
      </p>
      {textos.bajada && <p className="mb-4 text-center text-[#4b5b6d]">{textos.bajada}</p>}
      {valores.length > 0 ? (
        <ul className="grid grid-cols-3 gap-2">
          {valores.map((valor) => (
            <li
              key={valor.id}
              className="grid justify-items-center gap-[0.3rem] rounded-[0.45rem] border border-[#dbe3ec] px-[0.3rem] py-[0.6rem] text-center font-[650] text-[#154771] [overflow-wrap:anywhere]"
            >
              <IconoDeValor icono={valor.icono} className="size-[1.4rem] text-[#1d629c]" />
              {valor.nombre}
            </li>
          ))}
        </ul>
      ) : (
        <p className="py-6 text-center text-[#4b5b6d]">
          Sin valores, la sección no muestra razones.
        </p>
      )}
    </MarcoDeVistaPrevia>
  )
}
