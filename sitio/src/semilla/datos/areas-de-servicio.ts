import { AREAS_P1_A_P5 } from './areas-p1-a-p5'
import { AREAS_P6_A_P9 } from './areas-p6-a-p9'
import type { AreaSemilla } from './tipos'

// Las nueve áreas SIGE Mype del inicio v4 (`index.blade.php`: pestañas, paneles y gajos de la
// rueda), en orden de P1 a P9.
export const AREAS_DE_SERVICIO: readonly AreaSemilla[] = [...AREAS_P1_A_P5, ...AREAS_P6_A_P9]
