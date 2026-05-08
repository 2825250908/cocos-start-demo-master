import { _decorator } from 'cc'
import { DIRECTION_ENUM, ENTITY_STATE_ENUM, ENTITY_TYPE_ENUM } from '../../Enums'
import { WoodenSkeletonMachine } from './WoodenSkeletonMachine'
import { EntityManager } from '../../Base/EntityManager'
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
      x: 7,
      y: 6,
      type: ENTITY_TYPE_ENUM.PALYER,
      direction: DIRECTION_ENUM.BOTTOM,
      state: ENTITY_STATE_ENUM.IDLE,
    })
  }
}
