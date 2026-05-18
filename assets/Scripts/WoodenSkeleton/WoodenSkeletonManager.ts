import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import { WoodenSkeletonMachine } from './WoodenSkeletonMachine'
import { EntityManager } from '../../Base/EntityManager'
import { EventManager } from '../../Runtime/EventManager'
import { DataManager } from '../../Runtime/DataManager'
import { EnemyManager } from '../../Base/EnemyManager'
import { IEntity } from '../../Levels'
const { ccclass, property } = _decorator

/**
 * 怪物管理器类
 * 负责处理怪物npc的初始化、动画播放等功能
 */
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EnemyManager {
  /**
   * 初始化怪物角色
   * 完成以下功能：
   * 1. 创建 Sprite 组件并设置为自定义大小模式
   * 2. 设置怪物角色的显示尺寸
   * 3. 加载角色闲置状态的图片资源
   * 4. 创建并播放循环动画
   * @returns {Promise<void>} 无返回值
   */

  async init(parmas: IEntity) {
    // 创建动画组件
    this.fsm = this.addComponent(WoodenSkeletonMachine)
    // 初始化状态机
    await this.fsm.init()
    super.init(parmas)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
  }
  onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
  }
  // 根据玩家坐标判断怪物是否攻击
  onAttack() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.player
    const dx = playerX - this.x
    const dy = playerY - this.y
    if ((dx === 1 && dy === 0) || (dx === -1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 0 && dy === -1)) {
      this.state = ENTITY_STATE_ENUM.ATTACK
      EventManager.Instance.emit(EVENT_ENUM.ATTACK_PLAYER, ENTITY_STATE_ENUM.DEATH)
    } else {
      this.state = ENTITY_STATE_ENUM.IDLE
    }
  }
}
