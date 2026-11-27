import Image from 'next/image'

import { Icono } from '@/compartido/componentes/iconos/icono'

import type { AccionDePortada } from '../dominio/accion-de-portada'
import type { PortadaPublica } from '../dominio/portada'
import type { SegmentoDeTexto } from '../dominio/texto-resaltado'
import { ImagenDePortada } from './imagen-de-portada'
import estilos from './portada.module.css'

interface PropsPortada {
  portada: PortadaPublica
  primera: boolean
}

function Titulo({ segmentos, principal }: { segmentos: SegmentoDeTexto[]; principal: boolean }) {
  const Etiqueta = principal ? 'h1' : 'h2'
  return (
    <Etiqueta className={estilos.titulo}>
      {segmentos.map(({ texto, resaltado }, indice) =>
        resaltado ? <b key={indice}>{texto}</b> : texto,
      )}
    </Etiqueta>
  )
}

function Accion({ accion }: { accion: AccionDePortada }) {
  const clase = accion.estilo === 'principal' ? 'boton-contacto' : 'boton-linea'
  return (
    <a
      className={`boton ${clase}`}
      href={accion.href}
      rel={accion.externo ? 'noopener' : undefined}
    >
      {accion.icono ? <Icono nombre={accion.icono} /> : null}
      {accion.etiqueta}
    </a>
  )
}

function Lista({ puntos }: { puntos: string[] }) {
  return (
    <ul className={estilos.lista}>
      {puntos.map((punto, indice) => (
        <li key={indice}>
          <Icono nombre="incluido-circulo" />
          {punto}
        </li>
      ))}
    </ul>
  )
}

// Contenido de una portada, dibujado en el servidor. El carrusel decide cuál se ve.
export function Portada({ portada, primera }: PropsPortada) {
  const { titulo, subtitulo, sello, lista, acciones } = portada
  return (
    <>
      <ImagenDePortada portada={portada} primera={primera} />
      <div className={`contenedor ${estilos.texto}`}>
        {sello ? (
          <Image
            className={estilos.sello}
            src={sello.url}
            alt={sello.alt}
            width={sello.ancho}
            height={sello.alto}
            sizes="120px"
          />
        ) : null}
        {titulo ? <Titulo segmentos={titulo} principal={portada.esTituloPrincipal} /> : null}
        {subtitulo ? <p className={estilos.subtitulo}>{subtitulo}</p> : null}
        {lista.length > 0 ? <Lista puntos={lista} /> : null}
        {acciones.length > 0 ? (
          <div className={estilos.acciones}>
            {acciones.map((accion, indice) => (
              <Accion key={indice} accion={accion} />
            ))}
          </div>
        ) : null}
      </div>
    </>
  )
}
