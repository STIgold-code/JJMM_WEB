'use client'

import { Icono } from '@/compartido/componentes/iconos/icono'

import estilos from './controles.module.css'
import type { EstadoDelCarrusel } from './use-carrusel'

interface PropsControles {
  cantidad: number
  carrusel: EstadoDelCarrusel
}

function claseDeProgreso(indice: number, actual: number): string | undefined {
  if (indice < actual) return estilos.hecho
  return indice === actual ? estilos.corriendo : undefined
}

// Una barra por portada; la de la actual se llena y al terminar avanza a la siguiente.
function Progresos({ cantidad, carrusel }: PropsControles) {
  const { actual, vuelta, mostrar } = carrusel
  return (
    <div className={estilos.progresos}>
      {Array.from({ length: cantidad }, (_, indice) => (
        <button
          key={indice}
          type="button"
          className={claseDeProgreso(indice, actual)}
          aria-current={indice === actual ? 'true' : undefined}
          onClick={() => mostrar(indice)}
        >
          <span className={estilos.pista}>
            <i
              key={indice === actual ? vuelta : undefined}
              className={estilos.relleno}
              onAnimationEnd={indice === actual ? () => mostrar(actual + 1) : undefined}
            />
          </span>
          <span className="oculto">Portada {indice + 1}</span>
        </button>
      ))}
    </div>
  )
}

export function ControlesDelCarrusel({ cantidad, carrusel }: PropsControles) {
  const { actual, mostrar, alternarPausa, pausadoPorUsuario } = carrusel
  const estado = [
    carrusel.pausado ? estilos.pausado : '',
    carrusel.sinAvance ? estilos.sinAvance : '',
  ]
  return (
    <div className={`${estilos.controles} ${estado.join(' ')}`}>
      <div className={`contenedor ${estilos.fila}`}>
        <Progresos cantidad={cantidad} carrusel={carrusel} />
        <button className={estilos.boton} type="button" onClick={() => mostrar(actual - 1)}>
          <Icono nombre="anterior" />
          <span className="oculto">Portada anterior</span>
        </button>
        <button className={estilos.boton} type="button" onClick={() => mostrar(actual + 1)}>
          <Icono nombre="siguiente" />
          <span className="oculto">Portada siguiente</span>
        </button>
        <button
          className={estilos.boton}
          type="button"
          aria-pressed={pausadoPorUsuario}
          onClick={alternarPausa}
        >
          <Icono nombre={pausadoPorUsuario ? 'reproducir' : 'pausa'} />
          {/* Botón conmutador: el nombre es fijo y aria-pressed dice si está en pausa. */}
          <span className="oculto">Pausar las portadas</span>
        </button>
      </div>
    </div>
  )
}
