import Image from 'next/image'

import estilos from './graficos-del-panel.module.css'

// Logotipo de la pantalla de ingreso del panel. Es un archivo estático de `public/panel/` y no
// un medio de la base, así se ve también con la base vacía (creación del primer usuario).
// `unoptimized`: es un PNG chico y `images.localPatterns` solo admite los medios de Payload.
export function LogoDelPanel() {
  return (
    <span className={estilos.logo}>
      <Image
        src="/panel/logo-jjmm.png"
        alt="Estudio Contable JJMM, Mariñas & Asociados"
        width={223}
        height={125}
        unoptimized
        priority
      />
    </span>
  )
}
