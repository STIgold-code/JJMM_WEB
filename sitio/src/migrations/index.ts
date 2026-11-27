import * as migration_20261127_140109_inicial from './20261127_140109_inicial'

export const migrations = [
  {
    up: migration_20261127_140109_inicial.up,
    down: migration_20261127_140109_inicial.down,
    name: '20261127_140109_inicial',
  },
]
