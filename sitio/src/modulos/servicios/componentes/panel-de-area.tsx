import { Icono } from '@/compartido/componentes/iconos/icono'

import type { AreaGuardada } from '../aplicacion/listar-areas'

interface PropsPanelDeArea {
  area: Pick<AreaGuardada, 'codigo' | 'nombre' | 'descripcion' | 'puntos'>
  // Enlace de WhatsApp para consultar el área; sin configuración del sitio no hay botón.
  consulta: { href: string; texto: string } | null
}

// Detalle de un área de servicio, dibujado en el servidor. Las pestañas deciden cuál se ve.
export function PanelDeArea({ area, consulta }: PropsPanelDeArea) {
  return (
    <>
      <h3>
        <span>{area.codigo}:</span>
        {area.nombre}
      </h3>
      <p>{area.descripcion}</p>
      {area.puntos.length > 0 ? (
        <ul>
          {area.puntos.map((punto, indice) => (
            <li key={indice}>
              <Icono nombre="incluido" />
              {punto}
            </li>
          ))}
        </ul>
      ) : null}
      {consulta ? (
        <a className="boton boton-azul" href={consulta.href}>
          <Icono nombre="whatsapp" />
          {consulta.texto}
          <span className="oculto">: {area.nombre}</span>
        </a>
      ) : null}
    </>
  )
}
