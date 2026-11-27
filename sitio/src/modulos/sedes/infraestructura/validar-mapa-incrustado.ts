import { comoTexto } from '@/compartido/infraestructura/campos/validaciones'

import { esMapaIncrustadoDeGoogle } from '../dominio/mapa-de-sede'

const MENSAJE_MAPA =
  'Pega la dirección del mapa insertado de Google Maps (Compartir › Insertar un mapa): empieza con https://www.google.com/maps/embed?'

// Adaptador de `validate` de Payload. Vacío vale: el sitio arma el mapa con la dirección.
export const validarMapaIncrustadoOpcional = (valor: unknown): true | string => {
  const texto = comoTexto(valor)
  return texto === '' || esMapaIncrustadoDeGoogle(texto) || MENSAJE_MAPA
}
