import { propsDeRevelado } from '../revelado/props-de-revelado'
import estilos from './seccion.module.css'

// Clase del contenedor de una sección del inicio (espacio vertical de la v4).
export const CLASE_DE_SECCION = estilos.seccion

interface PropsEncabezadoDeSeccion {
  // id del título, para el aria-labelledby de la sección.
  id: string
  titulo: string
  bajada?: string | null
}

// Título y bajada de una sección. Entran con fadeInUp, como los títulos de producción (L9).
export function EncabezadoDeSeccion({ id, titulo, bajada }: PropsEncabezadoDeSeccion) {
  return (
    <>
      <h2 id={id} {...propsDeRevelado({ clase: estilos.titulo })}>
        {titulo}
      </h2>
      {bajada ? <p {...propsDeRevelado({ clase: estilos.bajada })}>{bajada}</p> : null}
    </>
  )
}

// Id estable del título de un bloque: su ancla si la tiene, o un nombre fijo por tipo.
export function idDeTitulo(tipo: string, ancla?: string | null): string {
  return `titulo-${ancla || tipo}`
}
