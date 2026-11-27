import Image from 'next/image'

import estilos from './panel-de-acceso.module.css'

// Panel de marca de las pantallas de acceso (ingreso, primer usuario, contraseña): columna azul
// a la izquierda en escritorio, franja arriba en celulares. Las imágenes son archivos de
// `public/panel/`, así se ven con la base vacía. `unoptimized`: `images.localPatterns` solo admite
// los medios de Payload.
export function PanelDeAcceso() {
  return (
    <aside className={estilos.panel} aria-label="Estudio Contable JJMM" data-panel-de-marca="">
      <div className={estilos.foto} aria-hidden="true">
        <Image src="/panel/acceso-jjmm.webp" alt="" fill sizes="42vw" unoptimized />
      </div>
      <div className={estilos.marca}>
        <Image
          className={estilos.ovalo}
          src="/panel/marca-jjmm.png"
          alt=""
          width={217}
          height={84}
          unoptimized
          priority
        />
        <p className={estilos.nombre}>
          Estudio Contable JJMM
          <span className={estilos.firma}>Mariñas &amp; Asociados</span>
        </p>
      </div>
      <p className={estilos.lema}>
        Desde aquí el equipo del estudio actualiza el sitio web: la página de inicio, la guía de
        clientes, el blog, las sedes y los mensajes que llegan por «Contáctanos».
      </p>
      <p className={estilos.pie}>¿No puedes ingresar? Pide ayuda a quien administra el panel.</p>
    </aside>
  )
}
