import { esCelularPeruano } from '@/compartido/dominio/celular'
import { prepararSedeDeContacto } from '@/modulos/sedes/dominio/sede-de-contacto'

import type { FormularioDeSede } from './formulario-de-sede'
import { direccionCompleta } from './sedes'

// Vista previa de la pestaña de una sede en «Contáctanos», con lo que se está escribiendo. Usa la
// misma regla del sitio (`prepararSedeDeContacto`): el distrito nombra la pestaña, WhatsApp va con
// el primer celular que lo atiende y la llamada con el primero de los otros.
export interface PestanaGuardada {
  id: number
  distrito: string
  visible: boolean
}

export interface VistaPreviaDeSede {
  // Pestañas visibles en el orden del sitio; `activa`, la de esta sede.
  pestanas: { texto: string; activa: boolean }[]
  nombre: string
  direccion: string
  whatsapp: string | null
  llamada: string | null
  oculta: boolean
}

interface Entrada {
  formulario: FormularioDeSede
  // `null`: una sede nueva, que se agrega al final.
  idDeLaSede: number | null
  // Todas las sedes guardadas, en su orden.
  sedes: readonly PestanaGuardada[]
}

const textoDePestana = (distrito: string) => distrito.trim() || 'Sin distrito'

function pestanas({ formulario, idDeLaSede, sedes }: Entrada): VistaPreviaDeSede['pestanas'] {
  const propia = { id: idDeLaSede, distrito: formulario.distrito, visible: formulario.visible }
  const conLaPropia = idDeLaSede === null ? [...sedes, propia] : sedes
  return conLaPropia
    .map((sede) => (sede.id === idDeLaSede ? propia : sede))
    .filter((sede) => sede.visible)
    .map((sede) => ({ texto: textoDePestana(sede.distrito), activa: sede.id === idDeLaSede }))
}

export function vistaPreviaDeSede(entrada: Entrada): VistaPreviaDeSede {
  const { formulario } = entrada
  // Los celulares a medio escribir no se muestran (el sitio solo publica celulares válidos).
  const celulares = formulario.celulares
    .filter((celular) => esCelularPeruano(celular.numero))
    .map(({ numero, tieneWhatsApp }) => ({ numero, tieneWhatsApp }))
  const sede = prepararSedeDeContacto(
    {
      nombre: formulario.nombre.trim(),
      direccion: formulario.direccion.trim(),
      distrito: formulario.distrito.trim(),
      ciudad: formulario.ciudad.trim(),
      celulares,
      mapaIncrustado: null,
    },
    '',
  )
  return {
    pestanas: pestanas(entrada),
    nombre: sede.nombre || 'Sin nombre',
    // Sin las comas de los datos que faltan («, , Lima»).
    direccion: direccionCompleta(formulario),
    whatsapp: sede.whatsapp?.texto ?? null,
    llamada: sede.llamada?.texto ?? null,
    oculta: !formulario.visible,
  }
}
