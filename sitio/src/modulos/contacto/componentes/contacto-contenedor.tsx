import {
  CLASE_DE_SECCION,
  EncabezadoDeSeccion,
  idDeTitulo,
} from '@/compartido/componentes/bloques/encabezado-de-seccion'
import type { PropsDeBloque } from '@/compartido/componentes/bloques/registro-de-bloques'
import { aImagen } from '@/compartido/infraestructura/imagen-de-medio'
import { obtenerSedesDeContacto } from '@/modulos/sedes/componentes/obtener-sedes-del-sitio'
import type { BloqueContacto } from '@/payload-types'

import estilos from './contacto.module.css'
import { FormularioDeContacto } from './formulario-de-contacto'
import { obtenerContactoDelSitio } from './obtener-contacto-del-sitio'
import { PestanasDeSedes } from './pestanas-de-sedes'

// Nombre de la lista de pestañas para lectores de pantalla.
const ETIQUETA_DE_SEDES = 'Sedes'

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

// Contenedor del bloque «Contáctanos» (v5): pestañas de las sedes activas y formulario.
// Sin configuración del sitio no hay celular al cual escribir: no se dibuja el formulario.
export async function ContactoContenedor({ bloque }: PropsDeBloque<BloqueContacto>) {
  const contacto = await obtenerContactoDelSitio()
  const sedes = await obtenerSedesDeContacto(contacto?.mensajeWhatsApp ?? '')
  const id = idDeTitulo(bloque.blockType, bloque.ancla)
  const { canales } = bloque
  const textos = { comoLlegar: canales?.comoLlegar || null, verMapa: canales?.botonDelMapa || null }
  return (
    <section
      className={`${CLASE_DE_SECCION} ${estilos.contacto}`}
      id={bloque.ancla || undefined}
      aria-labelledby={id}
    >
      <div className="contenedor">
        <EncabezadoDeSeccion id={id} titulo={bloque.titulo} bajada={bloque.bajada} />
        <div className={estilos.rejilla}>
          <PestanasDeSedes
            sedes={sedes}
            textos={textos}
            foto={aImagen(canales?.fotoDelMapa)}
            etiqueta={ETIQUETA_DE_SEDES}
          />
          {contacto ? (
            <FormularioDelBloque
              formulario={bloque.formulario}
              celularWhatsApp={contacto.celularWhatsApp}
            />
          ) : null}
        </div>
      </div>
    </section>
  )
}
