import { _decorator, Component, Sprite, UITransform } from 'cc'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enums'
import { TILE_HEIGHT, TILE_WIDTH } from '../Scripts/Tile/TileManager'
import { PlayerStateMachine } from '../Scripts/player/PlayerStateMachine'
import { IEntity } from '../Levels'
const { ccclass, property } = _decorator

/**
 * 玩家管理器类
 * 负责处理玩家角色的初始化、动画播放等功能
 */
@ccclass('EntityManager')
export class EntityManager extends Component {
  /**
   * 初始化玩家角色
   * 完成以下功能：
   * 1. 创建 Sprite 组件并设置为自定义大小模式
   * 2. 设置玩家角色的显示尺寸
   * 3. 加载角色闲置状态的图片资源
   * 4. 创建并播放循环动画
   * @returns {Promise<void>} 无返回值
   */
  x: number = 0 // 当前x位置
  y: number = 0 // 当前y位置
  fsm: PlayerStateMachine // 状态机
  private _direction: DIRECTION_ENUM // 当前角色方向
  private _state: ENTITY_STATE_ENUM // 当前角色状态
  private type: ENTITY_TYPE_ENUM
  // 获取当前方向
  get direction() {
    return this._direction
  }
  // 设置当前方向
  set direction(newVlaue) {
    this._direction = newVlaue
    this.fsm.setParams(PARAMS_NAME_ENUM.DIRECTION, DIRECTION_ORDER_ENUM[this._direction])
  }
  get state() {
    return this._state
  }
  set state(newVlaue) {
    this._state = newVlaue
    this.fsm.setParams(newVlaue as unknown as PARAMS_NAME_ENUM, true)
  }
  update(): void {
    this.node.setPosition(this.x * TILE_WIDTH - TILE_WIDTH * 1.5, -this.y * TILE_HEIGHT + TILE_HEIGHT * 1.5)
  }
  init(params: IEntity) {
    // 创建 Sprite 组件用于显示角色图片
    const sprite = this.addComponent(Sprite)
    // 设置为自定义大小模式以允许手动调整尺寸
    sprite.sizeMode = Sprite.SizeMode.CUSTOM
    // 获取 UI 变换组件
    const transform = this.getComponent(UITransform)
    // 根据瓦片尺寸设置角色显示大小（4 倍瓦片尺寸）
    transform.setContentSize(TILE_WIDTH * 4, TILE_HEIGHT * 4)
    // 角色坐标以及状态信息初始化
    this.x = params.x
    this.y = params.y
    this.direction = params.direction
    this.state = params.state
    this.type = params.type
  }
}
