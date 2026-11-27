interface ElementoEnfocado {
  matches(selector: string): boolean
}

// El carrusel se detiene mientras alguien lo recorre con el teclado, para que la portada no
// cambie debajo de lo que está leyendo. Un clic con el mouse también enfoca el botón, pero
// ahí no hay que pausar: `:focus-visible` distingue los dos casos.
export function debePausarPorFoco(elemento: ElementoEnfocado): boolean {
  return elemento.matches(':focus-visible')
}
