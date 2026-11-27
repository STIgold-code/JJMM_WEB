import { Icono } from '@/compartido/componentes/iconos/icono'

import estilos from './flotantes.module.css'

interface PropsBotonWhatsApp {
  href: string
  texto: string
}

// Botón flotante de WhatsApp. En el celular solo queda el ícono; el texto sigue siendo
// el nombre accesible del enlace.
export function BotonWhatsApp({ href, texto }: PropsBotonWhatsApp) {
  return (
    <a className={estilos.whatsapp} href={href}>
      <Icono nombre="whatsapp" />
      <span className={estilos.texto}>{texto}</span>
      <span className="oculto"> por WhatsApp</span>
    </a>
  )
}
