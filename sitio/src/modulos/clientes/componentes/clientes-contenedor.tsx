import Image from 'next/image'

import {
  CLASE_DE_SECCION,
  EncabezadoDeSeccion,
  idDeTitulo,
} from '@/compartido/componentes/bloques/encabezado-de-seccion'
import type { PropsDeBloque } from '@/compartido/componentes/bloques/registro-de-bloques'
import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'
import type { BloqueClientes } from '@/payload-types'

import type { ClienteVisible } from '../aplicacion/listar-clientes'
import estilos from './clientes.module.css'
import { obtenerClientes } from './obtener-clientes'
import { PistaDeClientes } from './pista-de-clientes'

// Nombre de la lista de logotipos para lectores de pantalla.
const ETIQUETA = 'Algunos de nuestros clientes'

function Logo({ cliente }: { cliente: ClienteVisible }) {
  const { logo, nombre, enlace } = cliente
  const imagen = (
    <Image
      src={logo.url}
      alt={logo.alt || nombre}
      width={logo.ancho}
      height={logo.alto}
      sizes="176px"
    />
  )
  if (!enlace) return imagen
  return (
    <a href={enlace} rel="noopener" target="_blank">
      {imagen}
      <span className="oculto"> (se abre en una pestaña nueva)</span>
    </a>
  )
}

// Contenedor del bloque «Clientes»: logotipos de los clientes visibles. Sin clientes no se dibuja.
export async function ClientesContenedor({ bloque }: PropsDeBloque<BloqueClientes>) {
  const clientes = await obtenerClientes()
  if (clientes.length === 0) return null
  const id = idDeTitulo(bloque.blockType, bloque.ancla)
  return (
    <section className={CLASE_DE_SECCION} id={bloque.ancla || undefined} aria-labelledby={id}>
      <div className="contenedor">
        <EncabezadoDeSeccion id={id} titulo={bloque.titulo} bajada={bloque.bajada} />
        <div {...propsDeRevelado({ clase: estilos.carrusel })}>
          <PistaDeClientes etiqueta={ETIQUETA}>
            {clientes.map((cliente) => (
              <li key={cliente.nombre}>
                <Logo cliente={cliente} />
              </li>
            ))}
          </PistaDeClientes>
        </div>
      </div>
    </section>
  )
}
