import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from '../Tile/TileMapManager'
import { PlayerManager } from '../player/PlayerManager'
import { EVENT_ENUM } from '../../Enums'
import { createUINode } from '../Utils/index'
import Levels, { Ilevel } from '../../Levels'
import { DataManager } from '../../Runtime/DataManager'
import { EventManager } from '../../Runtime/EventManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager'
const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  Level: Ilevel
  stage: Node
  start() {
    this.generateStage()
    this.initLevel()
  }
  onLoad(): void {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }
  onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }
  // 初始化地图总数据
  initLevel() {
    const level = Levels[`Level${DataManager.Instance.levelindex}`]
    if (level) {
      this.Level = level
      DataManager.Instance.mapInfo = this.Level.mapInfo
      DataManager.Instance.mapColumnCount = this.Level.mapInfo[0].length || 0 // x轴信息
      DataManager.Instance.mapRowCount = this.Level.mapInfo.length || 0 // y轴信息
      // 生成瓦片地图
      this.generateTileMap()
      // 生成角色
      this.generatePlayer()
    }
  }
  // 下一关
  nextLevel() {
    DataManager.Instance.levelindex++
    this.clearLevel()
    this.initLevel()
  }
  // 下一关
  lastLevel() {
    if (DataManager.Instance.levelindex === 1) return
    DataManager.Instance.levelindex--
    this.clearLevel()
    this.initLevel()
  }
  // 清空舞台以及关卡数据
  clearLevel() {
    this.stage.destroyAllChildren()
    DataManager.Instance.reset()
  }
  // 生成舞台
  generateStage() {
    // 1.创建一个名为 "stage" 舞台容器的空节点
    this.stage = createUINode('stage')
    // 2.将 stage 节点的父节点设置为 this.node（当前组件所在的节点）
    this.stage.setParent(this.node)
  }
  // 生成游戏角色
  generatePlayer() {
    // 1.创建一个名为 "player" 角色的节点
    const player = createUINode('player')
    // 2.将 player 节点添加为 stage 的子节点
    player.setParent(this.stage)
    // 3.给 player 节点添加 Sprite 组件
    const playerManager = player.addComponent(PlayerManager)
    playerManager.init()
  }
  // 生成瓦片地图
  generateTileMap() {
    // 3.在创建一个"tileMap" 地图容器的空节点
    const tileMap = createUINode('tileMap')
    // 4.将 tileMap 节点的父节点设置为 stage
    tileMap.setParent(this.stage)
    // 5.给 tileMap 节点添加 TileMapManager 组件
    const tieMapManager = tileMap.addComponent(TileMapManager)
    // 6.调用 TileMapManager 组件的 init() 方法初始化地图
    tieMapManager.init()
    // 7.调用 adjustPos() 方法调整地图位置
    this.adaotPos()
  }
  // 调整地图位置
  adaotPos() {
    const { mapColumnCount, mapRowCount } = DataManager.Instance
    const disx = (TILE_WIDTH * mapColumnCount) / 2
    const disY = (TILE_HEIGHT * mapRowCount) / 2
    this.stage.setPosition(-disx, disY + 70)
  }
}
