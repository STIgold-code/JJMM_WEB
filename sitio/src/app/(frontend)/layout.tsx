import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Estudio Contable JJMM',
  description: 'Estudio contable en Lima.',
}

interface PropiedadesLayoutPublico {
  children: ReactNode
}

export default function LayoutPublico({ children }: PropiedadesLayoutPublico) {
  return (
    <html lang="es-PE">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
