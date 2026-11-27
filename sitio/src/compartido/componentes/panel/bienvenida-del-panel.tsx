import { saludo } from './enlace-rapido'
import { TrazoDelPanel } from './trazos-del-panel'
import estilos from './bienvenida-del-panel.module.css'

interface Props {
  nombre: string | null | undefined
  fecha: string
}

// Encabezado del inicio del panel: saludo con el nombre de la cuenta, la fecha de hoy y el
// enlace al sitio público.
export function BienvenidaDelPanel({ nombre, fecha }: Props) {
  return (
    <header className={estilos.bienvenida}>
      <div>
        <h1 className={estilos.saludo}>{saludo(nombre)}</h1>
        <p className={estilos.fecha}>{fecha}. ¿Qué quieres actualizar hoy?</p>
      </div>
      <a className={estilos.verSitio} href="/" target="_blank" rel="noopener">
        Ver el sitio
        <TrazoDelPanel nombre="externo" className={estilos.icono} />
        <span className="sr-only"> (se abre en otra pestaña)</span>
      </a>
    </header>
  )
}
