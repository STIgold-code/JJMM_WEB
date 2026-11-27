import type { CSSProperties } from 'react'

import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'
import type { SegmentoDeTexto } from '@/modulos/portada/dominio/texto-resaltado'

import type { Cifra } from '../dominio/cifra'
import estilos from './quienes-somos.module.css'

interface PropsQuienesSomos {
  ancla: string | null
  idDelTitulo: string
  titulo: string
  cifras: readonly Cifra[]
  parrafos: readonly SegmentoDeTexto[][]
}

type EstiloConMeta = CSSProperties & { '--meta': number }

// Círculos con fadeInUp escalonado a 0,2 / 0,4 / 0,6 / 0,8 s, como en producción (L9).
const RETRASO_POR_CIRCULO = 0.2

function Circulo({ cifra, indice }: { cifra: Cifra; indice: number }) {
  const meta: EstiloConMeta = { '--meta': Math.round(cifra.valor) }
  return (
    <li {...propsDeRevelado({ retraso: RETRASO_POR_CIRCULO * (indice + 1) })}>
      {cifra.prefijo ? <small className={estilos.prefijo}>{cifra.prefijo}</small> : null}
      <b className={estilos.cifra}>
        <span className={estilos.cuenta} style={meta} aria-hidden="true" />
        <span className="oculto">{cifra.valor}</span>
        {cifra.sufijo ? ` ${cifra.sufijo}` : null}
      </b>
      <span className={estilos.descripcion}>{cifra.descripcion}</span>
    </li>
  )
}

// Presentación de «Quiénes somos». El título existe para lectores de pantalla y el menú,
// pero no se ve (v4): los círculos ya encabezan la sección.
export function QuienesSomos({ ancla, idDelTitulo, titulo, cifras, parrafos }: PropsQuienesSomos) {
  return (
    <section className={estilos.nosotros} id={ancla ?? undefined} aria-labelledby={idDelTitulo}>
      <div className="contenedor">
        <h2 className="oculto" id={idDelTitulo}>
          {titulo}
        </h2>
        {cifras.length > 0 ? (
          <ul className={estilos.circulos}>
            {cifras.map((cifra, indice) => (
              <Circulo key={indice} cifra={cifra} indice={indice} />
            ))}
          </ul>
        ) : null}
        {parrafos.map((segmentos, indice) => (
          <p key={indice} {...propsDeRevelado({ desde: 'derecha', clase: estilos.texto })}>
            {segmentos.map(({ texto, resaltado }, posicion) =>
              resaltado ? <strong key={posicion}>{texto}</strong> : texto,
            )}
          </p>
        ))}
      </div>
    </section>
  )
}
