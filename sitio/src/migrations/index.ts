import * as migration_20261127_140109_inicial from './20261127_140109_inicial'
import * as migration_20261127_164725_contacto_quitar_canales_y_sede_del_mapa from './20261127_164725_contacto_quitar_canales_y_sede_del_mapa'
import * as migration_20261127_164736_contacto_sedes_v5 from './20261127_164736_contacto_sedes_v5'

export const migrations = [
  {
    up: migration_20261127_140109_inicial.up,
    down: migration_20261127_140109_inicial.down,
    name: '20261127_140109_inicial',
  },
  {
    up: migration_20261127_164725_contacto_quitar_canales_y_sede_del_mapa.up,
    down: migration_20261127_164725_contacto_quitar_canales_y_sede_del_mapa.down,
    name: '20261127_164725_contacto_quitar_canales_y_sede_del_mapa',
  },
  {
    up: migration_20261127_164736_contacto_sedes_v5.up,
    down: migration_20261127_164736_contacto_sedes_v5.down,
    name: '20261127_164736_contacto_sedes_v5',
  },
]
