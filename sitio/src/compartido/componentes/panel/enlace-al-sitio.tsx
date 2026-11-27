import { TrazoDelPanel } from './trazos-del-panel'
import estilos from './enlace-al-sitio.module.css'

// Enlace al sitio público al pie de los enlaces del menú lateral (`afterNavLinks`).
export function EnlaceAlSitio() {
  return (
    <a className={estilos.enlace} href="/" target="_blank" rel="noopener">
      <TrazoDelPanel nombre="externo" className={estilos.icono} />
      Ver el sitio
      <span className="sr-only"> (se abre en otra pestaña)</span>
    </a>
  )
}
