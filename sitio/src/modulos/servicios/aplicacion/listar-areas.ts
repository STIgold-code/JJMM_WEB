import { esListaDePuntosValida } from '../dominio/area-de-servicio'

// Área de servicio tal como se guarda en el panel.
export interface AreaGuardada {
  codigo: string
  nombre: string
  nombreCorto: string
  descripcion: string
  puntos: string[]
  mensajeDeConsulta: string | null
  poligonoEnLaRueda: string | null
}

export interface RepositorioAreas {
  // En el orden del panel.
  listar(): Promise<readonly AreaGuardada[]>
}

// Un gajo con puntos inválidos no se dibuja en la rueda; el área sigue en las pestañas.
export function crearListarAreas(repositorio: RepositorioAreas) {
  return async (): Promise<AreaGuardada[]> => {
    const areas = await repositorio.listar()
    return areas.map((area) => {
      const poligono = area.poligonoEnLaRueda?.trim() ?? ''
      return { ...area, poligonoEnLaRueda: esListaDePuntosValida(poligono) ? poligono : null }
    })
  }
}
