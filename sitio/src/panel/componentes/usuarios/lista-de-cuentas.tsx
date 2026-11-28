'use client'

import { useState } from 'react'

import {
  filtrarUsuarios,
  type FiltroDeUsuarios,
  filtrosDeUsuarios,
  textoSinUsuarios,
  type UsuarioDelPanel,
} from '../../dominio/usuarios'
import { Buscador } from '../comunes/buscador'
import { FiltrosDeCuentas } from './filtros-de-cuentas'
import { FilaDeCuenta } from './fila-de-cuenta'

interface Props {
  cuentas: UsuarioDelPanel[]
  // La cuenta de la sesión, decidida en el servidor.
  idPropio: number
}

const ENCABEZADO = 'px-4 py-[0.6rem] font-semibold'

function Tabla({ cuentas, idPropio, textoVacio }: Props & { textoVacio: string }) {
  return (
    <table className="w-full border-collapse text-sm max-sm:block">
      <thead className="max-sm:hidden">
        <tr className="border-b text-left text-[0.8125rem] whitespace-nowrap text-muted-foreground">
          <th scope="col" className={ENCABEZADO}>
            Persona
          </th>
          <th scope="col" className={ENCABEZADO}>
            Rol
          </th>
          <th scope="col" className={`${ENCABEZADO} text-right`}>
            <span className="sr-only">Acciones</span>
          </th>
        </tr>
      </thead>
      <tbody className="max-sm:block">
        {cuentas.map((cuenta) => (
          <FilaDeCuenta key={cuenta.id} cuenta={cuenta} propia={cuenta.id === idPropio} />
        ))}
        {cuentas.length === 0 && (
          <tr className="max-sm:block">
            <td colSpan={3} className="px-4 py-10 text-center text-muted-foreground max-sm:block">
              {textoVacio}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

// Listado de cuentas con filtros por rol y buscador (en el navegador: son pocas cuentas).
export function ListaDeCuentas({ cuentas, idPropio }: Props) {
  const [filtro, setFiltro] = useState<FiltroDeUsuarios>('todos')
  const [busqueda, setBusqueda] = useState('')
  const visibles = filtrarUsuarios(cuentas, filtro, busqueda)
  return (
    <section
      aria-label="Lista de cuentas"
      className="rounded-lg border bg-card text-card-foreground shadow-sm"
    >
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-[0.85rem]">
        <FiltrosDeCuentas
          filtros={filtrosDeUsuarios(cuentas)}
          actual={filtro}
          alElegir={setFiltro}
        />
        <Buscador
          id="buscar-cuentas"
          etiqueta="Buscar cuentas"
          placeholder="Buscar por nombre o correo"
          valor={busqueda}
          alCambiar={setBusqueda}
        />
      </div>
      <Tabla
        cuentas={visibles}
        idPropio={idPropio}
        textoVacio={textoSinUsuarios(filtro, busqueda)}
      />
      <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t px-4 py-3 text-[0.8125rem] text-muted-foreground">
        <span aria-live="polite">
          Mostrando {visibles.length} de {cuentas.length}
        </span>
        <span>No puedes eliminar tu propia cuenta</span>
      </div>
    </section>
  )
}
