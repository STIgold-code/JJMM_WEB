import { Lock } from 'lucide-react'
import Link from 'next/link'

import { RUTA_DE_MI_CUENTA } from '../../dominio/usuarios'
import { EstadoVacio } from '../comunes/estado-vacio'
import { Button } from '../ui/button'

// Lo que ve un editor si entra a una pantalla solo del administrador (lo decide el servidor con
// el rol de la sesión; el menú ya no le muestra la entrada).
export function SoloParaElAdministrador() {
  return (
    <section
      aria-labelledby="titulo-solo-administrador"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <EstadoVacio
        Icono={Lock}
        nivel="h1"
        idDelTitulo="titulo-solo-administrador"
        titulo="Solo para el administrador"
        texto="Las cuentas del panel las crea y administra el administrador del estudio. Para cambiar tu nombre o tu contraseña, entra a Mi cuenta."
      >
        <Button asChild variant="outline" className="mt-2 bg-card">
          <Link href={RUTA_DE_MI_CUENTA}>Ir a Mi cuenta</Link>
        </Button>
      </EstadoVacio>
    </section>
  )
}
