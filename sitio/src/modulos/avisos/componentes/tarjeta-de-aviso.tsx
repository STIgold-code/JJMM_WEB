import { Icono } from '@/compartido/componentes/iconos/icono'
import { propsDeRevelado } from '@/compartido/componentes/revelado/props-de-revelado'
import type { EnlaceDeContacto } from '@/compartido/dominio/enlaces-de-contacto'

import estilos from './avisos.module.css'

interface PropsTarjetaDeAviso {
  titulo: string
  parrafos: readonly string[]
  documentos: readonly string[]
  correo: EnlaceDeContacto | null
  retraso: number
}

// Un aviso como tarjeta: cuándo aplica, qué documentos enviar y a qué correo.
export function TarjetaDeAviso({
  titulo,
  parrafos,
  documentos,
  correo,
  retraso,
}: PropsTarjetaDeAviso) {
  return (
    <article {...propsDeRevelado({ clase: estilos.tarjeta, retraso })}>
      <h3 className={estilos.titulo}>{titulo}</h3>
      <div className={estilos.cuando}>
        {parrafos.map((parrafo) => (
          <p key={parrafo}>{parrafo}</p>
        ))}
      </div>
      {documentos.length > 0 ? (
        <>
          <h4 className={estilos.subtitulo}>Documentos que debes enviar</h4>
          <ul className={estilos.documentos}>
            {documentos.map((documento) => (
              <li key={documento}>{documento}</li>
            ))}
          </ul>
        </>
      ) : null}
      {correo ? (
        <p className={estilos.correo}>
          <Icono nombre="correo" />
          <span>
            Escríbenos a <a href={correo.href}>{correo.texto}</a>
          </span>
        </p>
      ) : null}
    </article>
  )
}
