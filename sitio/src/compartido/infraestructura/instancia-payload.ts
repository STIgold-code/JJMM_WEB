import config from '@payload-config'
import { getPayload } from 'payload'

// Instancia de Payload para la Local API. getPayload la reutiliza entre llamadas.
export const obtenerPayload = () => getPayload({ config })
