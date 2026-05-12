import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM, EVENT_ENUM } from '../../Enums'
import { WoodenSkeletonMachine } from './WoodenSkeletonMachine'
import { EntityManager } from '../../Base/EntityManager'
import { EventManager } from '../../Runtime/EventManager'
import { DataManager } from '../../Runtime/DataManager'
const { ccclass, property } = _decorator

/**
 * 怪物管理器类
 * 负责处理怪物npc的初始化、动画播放等功能
 */
@ccclass('WoodenSkeletonManager')
export class WoodenSkeletonManager extends EntityManager {
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
    this.fsm = this.addComponent(WoodenSkeletonMachine)
    // 初始化状态机
    await this.fsm.init()
    super.init({
      x: 2,
      y: 4,
      type: ENTITY_TYPE_ENUM.PALYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
      id: this.node.uuid,
    })
    // 监听玩家角色初始化
    EventManager.Instance.on(EVENT_ENUM.PLAYER_BORN, this.onChangeDIrect, this)
    // 监听玩家移动结束事件
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDIrect, this)
    EventManager.Instance.on(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack, this)
    EventManager.Instance.on(EVENT_ENUM.ATTACK_ENEMY, this.onDead, this)
  }
  onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_BORN, this.onChangeDIrect)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onChangeDIrect)
    EventManager.Instance.off(EVENT_ENUM.PLAYER_MOVE_END, this.onAttack)
    EventManager.Instance.off(EVENT_ENUM.ATTACK_ENEMY, this.onDead)
  }
  // 监听玩家坐标修改怪物方向
  onChangeDIrect() {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    const { x: playerX, y: playerY } = DataManager.Instance.player
    const dx = playerX - this.x
    const dy = playerY - this.y
    if ((dx < 0 && dy < 0) || (dx === 0 && dy < 0)) {
      // 玩家在怪物的左上象限
      this.direction = DIRECTION_ENUM.TOP
    } else if ((dx < 0 && dy > 0) || (dx < 0 && dy === 0)) {
      // 玩家在怪物的左下象限
      this.direction = DIRECTION_ENUM.LEFT
    } else if ((dx > 0 && dy < 0) || (dx > 0 && dy === 0)) {
      // 玩家在怪物的右上象限
      this.direction = DIRECTION_ENUM.RIGHT
    } else if ((dx > 0 && dy > 0) || (dx === 0 && dy > 0)) {
      // 玩家在怪文的右下象限
      this.direction = DIRECTION_ENUM.BOTTOM
    }
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
  onDead(enemieId: string) {
    if (this.state === ENTITY_STATE_ENUM.DEATH) {
      return
    }
    if (enemieId === this.id) {
      this.state = ENTITY_STATE_ENUM.DEATH
    }
  }
}
