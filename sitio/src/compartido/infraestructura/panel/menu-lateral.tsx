'use client'

import { useConfig, useNav, useWindowInfo } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { debeAbrirMenu } from '../../componentes/panel/apertura-del-menu'
import { CabeceraDelMenu } from '../../componentes/panel/cabecera-del-menu'

// Queda en `true` cuando el menú ya estuvo abierto en esta carga del panel: si después la
// persona lo cierra, queda cerrado.
let yaAbierto = false

// Payload cierra el menú al cargar en pantallas de hasta 1440 px. En un escritorio de 1025 a
// 1440 px hay espacio para el menú y el contenido, así que se abre. El `setTimeout` deja que
// corra antes el efecto de Payload que lo cierra (los efectos del padre corren después), y se
// reintenta mientras el menú no haya llegado a verse abierto (Payload lo vuelve a cerrar cuando
// termina de medir la pantalla).
function useMenuAbiertoEnEscritorio() {
  const { hydrated, navOpen, setNavOpen } = useNav()
  const { breakpoints } = useWindowInfo()
  const hasta1440 = breakpoints.l === true
  const hasta1024 = breakpoints.m === true

  useEffect(() => {
    if (!hydrated) return
    if (navOpen) {
      yaAbierto = true
      return
    }
    const temporizador = setTimeout(() => {
      if (debeAbrirMenu({ hasta1440, hasta1024, abierto: navOpen, yaAbierto })) setNavOpen(true)
    }, 0)
    return () => clearTimeout(temporizador)
  }, [hydrated, hasta1440, hasta1024, navOpen, setNavOpen])
}

// Cabecera del menú lateral (`admin.components.beforeNavLinks`): marca y enlace al inicio, que
// Payload no incluye en su menú. Vive en infraestructura porque usa `@payloadcms/ui`.
export function CabeceraDelMenuLateral() {
  useMenuAbiertoEnEscritorio()
  const ruta = usePathname()
  const { config } = useConfig()
  const rutaDelPanel = config.routes.admin
  return <CabeceraDelMenu hrefDelInicio={rutaDelPanel} enElInicio={ruta === rutaDelPanel} />
}
