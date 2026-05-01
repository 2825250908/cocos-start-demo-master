import Level1 from './Level1'
import Level2 from './Level2'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, TILE_TYPE_ENUM, ENTITY_TYPE_ENUM } from '../Enums'

export interface IEntity {
  x: number
  y: number
  type: ENTITY_TYPE_ENUM
  direction: DIRECTION_ENUM
  state: ENTITY_STATE_ENUM
}

export interface ITile {
  src: number | null
  type: TILE_TYPE_ENUM | null
}

export interface Ilevel {
  mapInfo: Array<Array<ITile>>
}

const levels: Record<string, Ilevel> = {
  Level1,
  Level2,
}
export default levels
