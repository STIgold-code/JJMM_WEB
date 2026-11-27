import type { KeyboardEvent } from 'react'

const ENFOCABLES = 'a[href], button:not([disabled])'

// Mantiene el foco del teclado dentro de un diálogo modal: Tab en el último elemento
// vuelve al primero y Mayús+Tab en el primero va al último.
export function atraparFoco(evento: KeyboardEvent<HTMLElement>) {
  if (evento.key !== 'Tab') return
  const enfocables = Array.from(evento.currentTarget.querySelectorAll<HTMLElement>(ENFOCABLES))
  const primero = enfocables[0]
  const ultimo = enfocables.at(-1)
  if (!primero || !ultimo) return
  const activo = document.activeElement
  if (evento.shiftKey && activo === primero) {
    evento.preventDefault()
    ultimo.focus()
  } else if (!evento.shiftKey && activo === ultimo) {
    evento.preventDefault()
    primero.focus()
  }
}
