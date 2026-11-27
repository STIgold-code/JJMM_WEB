'use client'

import { useConfig, useNav, useWindowInfo } from '@payloadcms/ui'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import {
  debeAbrirMenu,
  type EleccionDelMenu,
  eleccionAlPulsarElBoton,
} from '../../componentes/panel/apertura-del-menu'
import { CabeceraDelMenu } from '../../componentes/panel/cabecera-del-menu'

// Clase del botón de Payload que abre y cierra el menú (`NavToggler` de @payloadcms/ui 3.94).
const BOTON_DEL_MENU = '.nav-toggler'
const CLAVE = 'panel-jjmm:menu'

const eleccionGuardada = (): string | null => {
  try {
    return window.localStorage.getItem(CLAVE)
  } catch {
    // Sin acceso al almacenamiento (modo privado estricto): el menú simplemente queda abierto.
    return null
  }
}

const guardarEleccion = (eleccion: EleccionDelMenu) => {
  try {
    window.localStorage.setItem(CLAVE, eleccion)
  } catch {
    // Ver `eleccionGuardada`.
  }
}

// Recuerda lo que la persona elige al pulsar el botón del menú.
function useEleccionDelMenu(abierto: boolean) {
  useEffect(() => {
    const alPulsar = (evento: MouseEvent) => {
      if (!(evento.target instanceof Element) || !evento.target.closest(BOTON_DEL_MENU)) return
      guardarEleccion(eleccionAlPulsarElBoton(abierto))
    }
    document.addEventListener('click', alPulsar, true)
    return () => document.removeEventListener('click', alPulsar, true)
  }, [abierto])
}

// Payload cierra el menú al cargar y en cada cambio de página en pantallas de hasta 1440 px.
// En un escritorio de 1025 a 1440 px hay espacio para el menú y el contenido, así que se vuelve
// a abrir cada vez, salvo que la persona lo haya cerrado. El `setTimeout` deja que corra antes
// el efecto de Payload que lo cierra (los efectos del padre corren después).
function useMenuAbiertoEnEscritorio() {
  const { hydrated, navOpen, setNavOpen } = useNav()
  const { breakpoints } = useWindowInfo()
  const hasta1440 = breakpoints.l === true
  const hasta1024 = breakpoints.m === true
  useEleccionDelMenu(navOpen)

  useEffect(() => {
    if (!hydrated || navOpen) return
    const temporizador = setTimeout(() => {
      const cerradoPorLaPersona = eleccionGuardada() === 'cerrado'
      if (debeAbrirMenu({ hasta1440, hasta1024, abierto: navOpen, cerradoPorLaPersona })) {
        setNavOpen(true)
      }
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
