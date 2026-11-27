import './estilos-globales.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { BarraSuperiorContenedor } from '@/compartido/componentes/estructura/barra-superior/barra-superior-contenedor'
import { CabeceraContenedor } from '@/compartido/componentes/estructura/cabecera/cabecera-contenedor'
import { obtenerDatosDelSitio } from '@/compartido/componentes/estructura/datos-del-sitio'
import { BotonSubir } from '@/compartido/componentes/estructura/flotantes/boton-subir'
import { BotonWhatsAppContenedor } from '@/compartido/componentes/estructura/flotantes/boton-whatsapp-contenedor'
import { metadatosPorDefecto } from '@/compartido/componentes/estructura/metadatos-por-defecto'
import { PieContenedor } from '@/compartido/componentes/estructura/pie/pie-contenedor'
import { SpriteDeIconos } from '@/compartido/componentes/iconos/sprite-de-iconos'
import { ObservadorDeRevelado } from '@/compartido/componentes/revelado/observador-de-revelado'
import { urlDelSitio } from '@/compartido/infraestructura/url-del-sitio-configurada'

import { openSans, oswald } from './fuentes/fuentes'

// El contenido sale de Payload en cada petición: la compilación no necesita base de datos.
// La revalidación al publicar (ISR) llega en T12.
export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  return metadatosPorDefecto(urlDelSitio(), await obtenerDatosDelSitio())
}

// Marca <html> antes de pintar para que `.revelar` oculte solo cuando hay JavaScript.
const MARCAR_JS = "document.documentElement.classList.add('js')"

interface PropiedadesLayoutPublico {
  children: ReactNode
}

export default function LayoutPublico({ children }: PropiedadesLayoutPublico) {
  return (
    // La clase `js` la agrega el script antes de hidratar; no es una discrepancia real.
    <html
      lang="es-PE"
      className={`${oswald.variable} ${openSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MARCAR_JS }} />
      </head>
      <body>
        <a className="saltar" href="#contenido">
          Saltar al contenido
        </a>
        <SpriteDeIconos />
        <BarraSuperiorContenedor />
        <CabeceraContenedor />
        <main id="contenido">{children}</main>
        <PieContenedor />
        <BotonSubir />
        <BotonWhatsAppContenedor />
        <ObservadorDeRevelado />
      </body>
    </html>
  )
}
