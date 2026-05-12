import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import { EntityManager } from '../../Base/EntityManager'
import { EventManager } from '../../Runtime/EventManager'
import { DoorMachine } from './DoorMachine'
import { DataManager } from '../../Runtime/DataManager'
const { ccclass, property } = _decorator

/**
 * 怪物管理器类
 * 负责处理怪物npc的初始化、动画播放等功能
 */
@ccclass('DoorManager')
export class DoorManager extends EntityManager {
  /**
   * 初始化怪物角色
   * 完成以下功能：
   * 1. 创建 Sprite 组件并设置为自定义大小模式
   * 2. 设置怪物角色的显示尺寸
   * 3. 加载角色闲置状态的图片资源
   * 4. 创建并播放循环动画
   * @returns {Promise<void>} 无返回值
   */

  async init() {
    // 创建动画组件
    this.fsm = this.addComponent(DoorMachine)
    // 初始化状态机
    await this.fsm.init()
    super.init({
      x: 7,
      y: 8,
      type: ENTITY_TYPE_ENUM.DOOR,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      id: this.node.uuid,
    })
    // 监听玩家角色初始化
    EventManager.Instance.on(EVENT_ENUM.DOOR_OPEN, this.open, this)
  }
  onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.DOOR_OPEN, this.open)
  }
  open() {
    if (DataManager.Instance.enemies.every(item => item.state === ENTITY_STATE_ENUM.DEATH)) {
      this.state = ENTITY_STATE_ENUM.DEATH
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }
}
