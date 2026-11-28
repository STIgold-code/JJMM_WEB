import { PanelsTopLeft } from 'lucide-react'

import type { DatosDeLaPaginaDeInicio } from '../../aplicacion/consultar-pagina-de-inicio'
import { EstadoVacio } from '../comunes/estado-vacio'
import { ListaDeSecciones } from './lista-de-secciones'

function Cabecera() {
  return (
    <div className="mb-6 grid gap-1">
      <h1 className="font-marca text-[1.75rem] leading-[1.15] font-medium tracking-[0.005em] text-balance max-sm:text-2xl">
        Página de inicio
      </h1>
      <p className="max-w-[60ch] text-muted-foreground">
        Las secciones del inicio del sitio, de arriba hacia abajo. Cámbialas de orden o abre una
        para editar sus textos e imágenes.
      </p>
    </div>
  )
}

// Pantalla «Página de inicio» (presentación): las secciones en su orden o, si la página nunca se
// guardó, un estado vacío que explica qué aparecerá aquí.
export function PantallaDeLaPaginaDeInicio({ datos }: { datos: DatosDeLaPaginaDeInicio }) {
  return (
    <div className="max-w-[48rem]">
      <Cabecera />
      {datos.secciones.length > 0 ? (
        <ListaDeSecciones datos={datos} />
      ) : (
        <section
          aria-label="Secciones"
          className="rounded-lg border bg-card text-card-foreground shadow-sm"
        >
          <EstadoVacio
            Icono={PanelsTopLeft}
            titulo="La página de inicio aún no tiene secciones"
            texto="Aquí aparecerán las secciones del inicio del sitio (el carrusel de portadas, «Quiénes somos», los planes y las demás) en el orden en que se muestran, para ordenarlas y editarlas."
          />
        </section>
      )}
    </div>
  )
}
