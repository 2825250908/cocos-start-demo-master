import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'
import { PlayerManager } from '../Scripts/player/PlayerManager'
import { TileManager } from '../Scripts/Tile/TileManager'
import { WoodenSkeletonManager } from '../Scripts/WoodenSkeleton/WoodenSkeletonManager'

// 初始化地图数据
export class DataManager extends Singleton {
  static get Instance() {
    return super.getInstance<DataManager>()
  }
  mapInfo: Array<Array<ITile>>
  tileInfo: Array<Array<TileManager>>
  mapRowCount: number = 0
  mapColumnCount: number = 0
  levelindex: number = 1
  player: PlayerManager // 玩家信息
  enemies: WoodenSkeletonManager[] = [] // 敌人信息列表
  /**
   * 重置地图数据到初始状态
   * 清空地图信息数组，并将行数和列数重置为0
   */
  reset() {
    this.mapInfo = []
    this.tileInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
    this.player = null
    this.enemies = []
  }
}
