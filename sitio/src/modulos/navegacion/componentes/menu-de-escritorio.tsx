import type { EstadoActual } from '../dominio/item-actual'
import type { ItemDeMenu } from '../dominio/item-de-menu'
import { EnlaceDeMenu } from './enlace-de-menu'
import estilos from './menu-de-escritorio.module.css'

interface PropsMenuDeEscritorio {
  items: readonly ItemDeMenu[]
  actualDe: (item: ItemDeMenu) => EstadoActual
}

// Menú horizontal de la cabecera; se oculta por debajo de 70rem, donde se usa el panel.
export function MenuDeEscritorio({ items, actualDe }: PropsMenuDeEscritorio) {
  return (
    <nav className={estilos.menu} aria-label="Principal">
      {items.map((item) => (
        <EnlaceDeMenu
          key={`${item.etiqueta}-${item.href}`}
          item={item}
          actual={actualDe(item)}
          variante="cabecera"
        />
      ))}
    </nav>
  )
}
