import Image from 'next/image'

import { FormularioDeIngreso } from './formulario-de-ingreso'

// Ingreso al panel: formulario a la izquierda y foto del estudio a la derecha (se oculta por
// debajo de 900 px).
export function PantallaDeIngreso() {
  return (
    <div className="grid min-h-screen bg-card escritorio:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <main className="grid content-center justify-items-center px-6 py-10">
        <div className="grid w-full max-w-[23rem] gap-6">
          <Image
            src="/panel/logo-jjmm.png"
            alt="JJMM, Mariñas & Asociados, Estudio Contable"
            width={216}
            height={128}
            priority
            className="h-auto w-44"
          />
          <div className="grid gap-3">
            <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium text-balance max-sm:text-2xl">
              Ingresa al panel
            </h1>
            <p className="text-muted-foreground">
              Administra el sitio web del estudio: mensajes, planes, sedes y publicaciones.
            </p>
          </div>
          <FormularioDeIngreso />
        </div>
      </main>
      <div
        aria-hidden="true"
        className="relative hidden overflow-hidden bg-primary-hover bg-[url(/panel/acceso-jjmm.webp)] bg-cover bg-center escritorio:block"
      >
        <div className="absolute inset-0 bg-linear-to-b from-[rgb(0_60_112/0)] from-40% to-[rgb(0_40_76/0.85)]" />
        <p className="absolute right-10 bottom-10 left-10 z-10 max-w-md font-marca text-[1.6rem] leading-[1.25] font-normal text-white">
          Cada empresa guiada por nuestro sistema, llega a ser líder.
        </p>
      </div>
    </div>
  )
}
