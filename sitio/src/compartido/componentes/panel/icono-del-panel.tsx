import estilos from './graficos-del-panel.module.css'

// Ícono de la barra superior del panel (enlace al inicio, junto a la ruta de navegación). Es el
// óvalo «JJMM» del logotipo en versión mínima: el sello completo no se lee a 18 px.
// Decorativo: Payload ya rotula el enlace que lo contiene.
export function IconoDelPanel() {
  return (
    <span className={estilos.icono} aria-hidden="true">
      JJMM
    </span>
  )
}
