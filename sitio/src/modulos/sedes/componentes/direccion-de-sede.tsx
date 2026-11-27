import { Fragment } from 'react'

import type { SedePublica } from '../dominio/sede'

interface PropsDireccionDeSede {
  sede: SedePublica
  claseDelTitulo?: string
}

// Nombre, dirección, celulares y correo de una sede, como en el pie de la v4.
export function DireccionDeSede({ sede, claseDelTitulo }: PropsDireccionDeSede) {
  return (
    <div>
      <h2 className={claseDelTitulo}>{sede.nombre}</h2>
      <address>
        {sede.direccion}
        <br />
        {sede.localidad}
        {sede.celulares.length > 0 ? (
          <>
            <br />
            Celular:{' '}
            {sede.celulares.map((celular, indice) => (
              <Fragment key={celular.href}>
                {indice > 0 ? ' · ' : null}
                <a href={celular.href}>{celular.texto}</a>
              </Fragment>
            ))}
          </>
        ) : null}
        {sede.correo ? (
          <>
            <br />
            <a href={sede.correo.href}>{sede.correo.texto}</a>
          </>
        ) : null}
      </address>
    </div>
  )
}
