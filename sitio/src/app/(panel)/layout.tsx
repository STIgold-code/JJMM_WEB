import './panel.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { openSans, oswald } from './fuentes-del-panel'

// Layout raíz del panel propio. Es el único que carga Tailwind (`panel.css`): el sitio público
// y el /admin de Payload tienen sus propios layouts raíz y no reciben estos estilos.
export const metadata: Metadata = {
  title: { template: '%s · Panel JJMM', default: 'Panel JJMM' },
  robots: { index: false, follow: false },
}

export default function LayoutDelPanel({ children }: { children: ReactNode }) {
  return (
    <html lang="es-PE" className={`${openSans.variable} ${oswald.variable}`}>
      <body>{children}</body>
    </html>
  )
}
