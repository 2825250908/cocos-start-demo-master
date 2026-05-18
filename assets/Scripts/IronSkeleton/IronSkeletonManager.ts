import { _decorator } from 'cc'
import { IronSkeletonMachine } from './IronSkeletonMachine'
import { EnemyManager } from '../../Base/EnemyManager'
import { IEntity } from '../../Levels'
const { ccclass, property } = _decorator

/**
 * 怪物管理器类
 * 负责处理怪物npc的初始化、动画播放等功能
 */
@ccclass('IronSkeletonManager')
export class IronSkeletonManager extends EnemyManager {
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
    this.fsm = this.addComponent(IronSkeletonMachine)
    // 初始化状态机
    await this.fsm.init()
    super.init(parmas)
  }
}
