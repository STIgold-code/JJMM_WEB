import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'

import type { GrupoDeVencimientos, Vencimiento } from '../dominio/vencimiento'
import estilos from './vencimientos.module.css'

interface PropsSeccionVencimientos {
  titulo: string
  grupos: readonly GrupoDeVencimientos[]
}

function Obligacion({ obligacion, cuandoVence, nota }: Vencimiento) {
  return (
    <div className={estilos.fila}>
      <dt>{obligacion}</dt>
      <dd>
        {cuandoVence}
        {nota ? <span className={estilos.nota}>{nota}</span> : null}
      </dd>
    </div>
  )
}

function Grupo({ grupo, retraso }: { grupo: GrupoDeVencimientos; retraso: number }) {
  const idDelTitulo = `vencimientos-${grupo.periodicidad}`
  return (
    <section aria-labelledby={idDelTitulo} {...propsDeRevelado({ clase: estilos.grupo, retraso })}>
      <h3 id={idDelTitulo} className={estilos.tituloDelGrupo}>
        {grupo.titulo}
      </h3>
      <dl className={estilos.lista}>
        {grupo.vencimientos.map((vencimiento) => (
          <Obligacion key={vencimiento.obligacion} {...vencimiento} />
        ))}
      </dl>
    </section>
  )
}

// Obligaciones y cuándo vencen, agrupadas en mensuales y anuales.
export function SeccionVencimientos({ titulo, grupos }: PropsSeccionVencimientos) {
  if (grupos.length === 0) return null
  return (
    <section id="vencimientos" className={estilos.seccion} aria-labelledby="titulo-vencimientos">
      <div className="contenedor">
        <h2 id="titulo-vencimientos" {...propsDeRevelado({ clase: estilos.encabezado })}>
          {titulo}
        </h2>
        <div className={estilos.grupos}>
          {grupos.map((grupo, posicion) => (
            <Grupo key={grupo.periodicidad} grupo={grupo} retraso={posicion * 0.2} />
          ))}
        </div>
      </div>
    </section>
  )
}
