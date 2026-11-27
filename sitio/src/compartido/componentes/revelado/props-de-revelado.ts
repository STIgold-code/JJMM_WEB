import type { CSSProperties } from 'react'

// Aparición al hacer scroll (animaciones WOW del sitio anterior, S6). Las clases globales
// `revelar`, `desde-izquierda` y `desde-derecha` están en `estilos-globales.css` y el
// ObservadorDeRevelado del layout agrega `visible` cuando el elemento entra en pantalla.
export interface OpcionesDeRevelado {
  desde?: 'abajo' | 'izquierda' | 'derecha'
  // Segundos de espera antes de entrar, para escalonar elementos hermanos.
  retraso?: number
  // Clases propias del componente (por ejemplo, la de su CSS Module).
  clase?: string
}

type EstiloConRetraso = CSSProperties & { '--retraso'?: string }

export interface PropsDeRevelado {
  className: string
  style?: EstiloConRetraso
}

export function propsDeRevelado(opciones: OpcionesDeRevelado = {}): PropsDeRevelado {
  const { desde = 'abajo', retraso, clase } = opciones
  const clases = [clase, 'revelar', desde === 'abajo' ? null : `desde-${desde}`]
  const className = clases.filter(Boolean).join(' ')
  return retraso ? { className, style: { '--retraso': `${retraso}s` } } : { className }
}
