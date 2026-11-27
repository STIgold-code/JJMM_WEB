import {
  CLASE_DE_SECCION,
  EncabezadoDeSeccion,
  idDeTitulo,
} from '@/compartido/componentes/bloques/encabezado-de-seccion'
import type { PropsDeBloque } from '@/compartido/componentes/bloques/registro-de-bloques'
import { obtenerDatosDelSitio } from '@/compartido/componentes/estructura/datos-del-sitio'
import type { CanalesDeContacto as Canales } from '@/compartido/dominio/configuracion-del-sitio'
import type { BloqueContacto } from '@/payload-types'

import { mapearSedeDelMapa } from '../infraestructura/mapear-sede-del-mapa'
import { type CanalVisible, CanalesDeContacto } from './canales-de-contacto'
import estilos from './contacto.module.css'
import { FormularioDeContacto } from './formulario-de-contacto'
import { MapaDeSede } from './mapa-de-sede'
import { obtenerContactoDelSitio } from './obtener-contacto-del-sitio'

type TitulosDeCanales = NonNullable<BloqueContacto['canales']>

// Los títulos son del bloque (el panel trae valores por defecto); vacío, se ve solo el dato.
function canalesVisibles(canales: Canales, titulos: TitulosDeCanales | undefined): CanalVisible[] {
  return [
    {
      titulo: titulos?.whatsapp || null,
      enlace: canales.whatsapp,
      icono: 'whatsapp',
      destacado: true,
    },
    {
      titulo: titulos?.llamada || null,
      enlace: canales.llamadas,
      icono: 'telefono',
      destacado: false,
    },
    { titulo: titulos?.correo || null, enlace: canales.correo, icono: 'correo', destacado: false },
  ]
}

interface PropsFormularioDelBloque {
  formulario: BloqueContacto['formulario']
  celularWhatsApp: string
}

function FormularioDelBloque({ formulario, celularWhatsApp }: PropsFormularioDelBloque) {
  return (
    <FormularioDeContacto
      titulo={formulario.titulo}
      texto={formulario.texto || null}
      textoDelBoton={formulario.textoDelBoton}
      opcionesDeServicio={(formulario.opcionesDeServicio ?? []).map((opcion) => opcion.texto)}
      celularWhatsApp={celularWhatsApp}
    />
  )
}

// Contenedor del bloque «Contacto»: formulario, canales de la configuración y mapa de la sede.
// Sin configuración del sitio no hay celular al cual escribir: se dibujan solo el título y el mapa.
export async function ContactoContenedor({ bloque }: PropsDeBloque<BloqueContacto>) {
  const [datos, contacto] = await Promise.all([obtenerDatosDelSitio(), obtenerContactoDelSitio()])
  const id = idDeTitulo(bloque.blockType, bloque.ancla)
  const sede = mapearSedeDelMapa(bloque.sedeDelMapa)
  const canales = datos ? canalesVisibles(datos.canales, bloque.canales) : []
  return (
    <section
      className={`${CLASE_DE_SECCION} ${estilos.contacto}`}
      id={bloque.ancla || undefined}
      aria-labelledby={id}
    >
      <div className="contenedor">
        <EncabezadoDeSeccion id={id} titulo={bloque.titulo} bajada={bloque.bajada} />
        <div className={estilos.rejilla}>
          {contacto ? (
            <FormularioDelBloque
              formulario={bloque.formulario}
              celularWhatsApp={contacto.celularWhatsApp}
            />
          ) : null}
          <div className={estilos.lado}>
            <CanalesDeContacto canales={canales} />
            {sede ? (
              <MapaDeSede
                sede={sede}
                textoDelBoton={bloque.canales?.botonDelMapa || null}
                retraso={0.24}
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
