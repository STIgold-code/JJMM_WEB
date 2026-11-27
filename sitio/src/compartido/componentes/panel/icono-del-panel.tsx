import Image from 'next/image'

import estilos from './graficos-del-panel.module.css'

// Ícono de la barra del panel: el sello SIGE Mype del estudio, el mismo del favicon del sitio.
// Decorativo: Payload ya rotula el enlace que lo contiene.
export function IconoDelPanel() {
  return (
    <Image
      className={estilos.icono}
      src="/panel/sello-jjmm.png"
      alt=""
      width={32}
      height={32}
      unoptimized
    />
  )
}
