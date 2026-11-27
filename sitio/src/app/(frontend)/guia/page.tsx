import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { obtenerGuiaDeClientes } from '@/modulos/avisos/componentes/obtener-avisos'
import { SeccionAvisosContenedor } from '@/modulos/avisos/componentes/seccion-avisos-contenedor'
import {
  SeccionCronogramaContenedor,
  SeccionVencimientosContenedor,
} from '@/modulos/vencimientos/componentes/contenedores'

import { EncabezadoDeGuia } from './encabezado-de-guia'

const RUTA = '/guia'

export async function generateMetadata(): Promise<Metadata> {
  const guia = await obtenerGuiaDeClientes()
  if (!guia) return {}
  const { titulo, descripcion } = guia.seo
  // Sin descripción propia se hereda la del sitio (layout).
  const conDescripcion = descripcion ? { description: descripcion } : {}
  return {
    title: titulo,
    ...conDescripcion,
    alternates: { canonical: RUTA },
    openGraph: { type: 'website', title: titulo, url: RUTA, ...conDescripcion },
  }
}

// Guía de clientes (S7): avisos, vencimientos y cronograma de SUNAT, todo desde el panel.
export default async function PaginaGuia() {
  const guia = await obtenerGuiaDeClientes()
  if (!guia) notFound()
  return (
    <>
      <EncabezadoDeGuia titulo={guia.titulo} introduccion={guia.introduccion} />
      <SeccionAvisosContenedor titulo={guia.tituloDeAvisos} />
      <SeccionVencimientosContenedor titulo={guia.tituloDeVencimientos} />
      <SeccionCronogramaContenedor titulo={guia.tituloDelCronograma} />
    </>
  )
}
