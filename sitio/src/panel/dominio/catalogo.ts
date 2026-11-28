import type { Rol } from '@/compartido/dominio/roles'

// Valores, clientes y filas de la tabla de planes: igual que mensajes, planes y sedes (L4 e),
// solo el administrador borra. Las colecciones dejan borrar al equipo, así que esta regla decide
// si el botón se muestra y la acción lo rechaza antes de tocar Payload.
export function puedeEliminarDelCatalogo(rol: Rol): boolean {
  return rol === 'administrador'
}
