import { CambiarContrasena } from './cambiar-contrasena'
import { DatosDeMiCuenta } from './datos-de-mi-cuenta'

interface Props {
  nombre: string
  correo: string
  rol: string
}

// Pantalla «Mi cuenta» (presentación): los datos de la cuenta de la sesión y el cambio de
// contraseña, en una sola columna como la maqueta aprobada.
export function PantallaDeMiCuenta({ nombre, correo, rol }: Props) {
  return (
    <>
      <div className="mb-6 grid gap-1">
        <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
          Mi cuenta
        </h1>
        <p className="max-w-[60ch] text-muted-foreground">Tus datos para entrar al panel.</p>
      </div>
      <div className="grid max-w-3xl grid-cols-[minmax(0,1fr)] gap-6">
        <DatosDeMiCuenta nombre={nombre} correo={correo} rol={rol} />
        <CambiarContrasena correo={correo} />
      </div>
    </>
  )
}
