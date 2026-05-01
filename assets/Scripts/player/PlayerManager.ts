import { _decorator, Component, animation, Sprite, AnimationClip, UITransform, Animation, SpriteFrame } from 'cc'
import {
  CONTROLLER_ENUM,
  DIRECTION_ENUM,
  DIRECTION_ORDER_ENUM,
  ENTITY_STATE_ENUM,
  ENTITY_TYPE_ENUM,
  EVENT_ENUM,
  PARAMS_NAME_ENUM,
} from '../../Enums'
import { TILE_HEIGHT, TILE_WIDTH, TileManager } from '../Tile/TileManager'
import { ResoureceManager } from '../../Runtime/ResoureceManager'
import { EventManager } from '../../Runtime/EventManager'
import { PlayerStateMachine } from './PlayerStateMachine'
import { EntityManager } from '../../Base/EntityManager'
import { DataManager } from '../../Runtime/DataManager'
import { ITile } from '../../Levels'
const { ccclass, property } = _decorator

// 方向偏移量配置表
const DIRECTION_OFFSETS = {
  [CONTROLLER_ENUM.TOP]: { x: 0, y: -1 },
  [CONTROLLER_ENUM.BOTTOM]: { x: 0, y: 1 },
  [CONTROLLER_ENUM.LEFT]: { x: -1, y: 0 },
  [CONTROLLER_ENUM.RIGHT]: { x: 1, y: 0 },
}

// 转向方向映射表
const TURN_DIRECTIONS = {
  [CONTROLLER_ENUM.TURNLEFT]: {
    [DIRECTION_ENUM.TOP]: [
      { x: -1, y: 0 },
      { x: -1, y: -1 },
    ],
    [DIRECTION_ENUM.BOTTOM]: [
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ],
    [DIRECTION_ENUM.LEFT]: [
      { x: 0, y: 1 },
      { x: -1, y: 1 },
    ],
    [DIRECTION_ENUM.RIGHT]: [
      { x: 0, y: -1 },
      { x: 1, y: -1 },
    ],
  },
  [CONTROLLER_ENUM.TURNRIGHT]: {
    [DIRECTION_ENUM.TOP]: [
      { x: 1, y: 0 }, // 右
      { x: 1, y: -1 }, // 右上
    ],
    [DIRECTION_ENUM.BOTTOM]: [
      { x: -1, y: 0 }, // 左
      { x: -1, y: 1 }, // 左下
    ],
    [DIRECTION_ENUM.LEFT]: [
      { x: 0, y: -1 }, // 上
      { x: -1, y: -1 }, // 左上
    ],
    [DIRECTION_ENUM.RIGHT]: [
      { x: 0, y: 1 }, // 下
      { x: 1, y: 1 }, // 右下
    ],
  },
}

/**
 * 玩家管理器类
 * 负责处理玩家角色的初始化、动画播放等功能
 */
@ccclass('PlayerManager')
export class PlayerManager extends EntityManager {
  /**
   * 初始化玩家角色
   * 完成以下功能：
   * 1. 创建 Sprite 组件并设置为自定义大小模式
   * 2. 设置玩家角色的显示尺寸
   * 3. 加载角色闲置状态的图片资源
   * 4. 创建并播放循环动画
   * @returns {Promise<void>} 无返回值
   */
  targetX: number = 0 // 目标x位置
  targetY: number = 0 // 当前y位置
  // 行动速率
  private readonly speed = 1 / 10
  update(): void {
    // 创建主角的行动监听
    this.updataXY()
    // 调用父类的监听函数修改角色模型的大小
    super.update()
  }
  onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.PLAYER_CTRL, this.move)
  }

  async init() {
    // 创建动画组件
    this.fsm = this.addComponent(PlayerStateMachine)
    // 初始化状态机
    await this.fsm.init()
    super.init({
      x: 2,
      y: 8,
      type: ENTITY_TYPE_ENUM.PALYER,
      direction: DIRECTION_ENUM.TOP,
      state: ENTITY_STATE_ENUM.IDLE,
    })
    this.targetX = 2
    this.targetY = 8
    // 监听玩家控制器事件
    EventManager.Instance.on(EVENT_ENUM.PLAYER_CTRL, this.inputHandle, this)
  }
  inputHandle(inputDirection: CONTROLLER_ENUM) {
    if (this.willBlock(inputDirection)) {
      return
    }
    this.move(inputDirection)
  }
  // 更新目标坐标
  move(inputDirection: CONTROLLER_ENUM) {
    if (inputDirection === CONTROLLER_ENUM.TOP) {
      this.targetY -= 1
    }
    if (inputDirection === CONTROLLER_ENUM.BOTTOM) {
      this.targetY += 1
    }
    if (inputDirection === CONTROLLER_ENUM.LEFT) {
      this.targetX -= 1
    }
    if (inputDirection === CONTROLLER_ENUM.RIGHT) {
      this.targetX += 1
    }
    if (inputDirection == CONTROLLER_ENUM.TURNLEFT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.TOP
      }
      this.state = ENTITY_STATE_ENUM.TURNLEFT
    }
    if (inputDirection == CONTROLLER_ENUM.TURNRIGHT) {
      if (this.direction === DIRECTION_ENUM.TOP) {
        this.direction = DIRECTION_ENUM.RIGHT
      } else if (this.direction === DIRECTION_ENUM.LEFT) {
        this.direction = DIRECTION_ENUM.TOP
      } else if (this.direction === DIRECTION_ENUM.BOTTOM) {
        this.direction = DIRECTION_ENUM.LEFT
      } else if (this.direction === DIRECTION_ENUM.RIGHT) {
        this.direction = DIRECTION_ENUM.BOTTOM
      }
      this.state = ENTITY_STATE_ENUM.TURNRIGHT
    }
  }
  // 更新实际坐标
  updataXY() {
    if (this.targetX < this.x) {
      this.x -= this.speed
    } else if (this.targetX > this.x) {
      this.x += this.speed
    }
    if (this.targetY < this.y) {
      this.y -= this.speed
    } else if (this.targetY > this.y) {
      this.y += this.speed
    }
    if (Math.abs(this.targetX - this.x) <= 0.1 && Math.abs(this.targetY - this.y) <= 0.1) {
      this.x = this.targetX
      this.y = this.targetY
    }
  }
  // 判断下一步的坐标能否移动（优化后的版本）
  willBlock(inputDirection: CONTROLLER_ENUM) {
    const { targetX: x, targetY: y, direction } = this
    const { tileInfo } = DataManager.Instance
    // 处理移动
    if (inputDirection === CONTROLLER_ENUM.TURNLEFT || inputDirection === CONTROLLER_ENUM.TURNRIGHT) {
      return this.checkTurnCollision(inputDirection, direction, x, y, tileInfo)
    }
    return this.checkMoveCollision(inputDirection, direction, x, y, tileInfo)
  }

  // 检查移动碰撞
  private checkMoveCollision(
    inputDirection: CONTROLLER_ENUM, // 要执行的动作
    direction: DIRECTION_ENUM, // 当前方向
    x: number,
    y: number,
    tileInfo: Array<Array<TileManager>>,
  ): boolean {
    // 获取方向偏移
    const weaponOffset = DIRECTION_OFFSETS[direction]
    const playerOffset = DIRECTION_OFFSETS[inputDirection]
    // // 计算下一步位置
    const playerNextX = x + playerOffset.x // 人物移动的下一个x轴
    const playerNextY = y + playerOffset.y // 人物移动的下一个y轴
    const weaponNextX = playerNextX + weaponOffset.x //人物武器的下一个x轴
    const weaponNextY = playerNextY + weaponOffset.y // 人物武器的下一个y轴
    const playerTile = tileInfo[playerNextX][playerNextY]
    const weaponTile = tileInfo[weaponNextX][weaponNextY]
    if (!playerTile.movable || !weaponTile.turnable) {
      return true
    }
    return false
  }

  // 检查转向碰撞
  private checkTurnCollision(
    inputDirection: CONTROLLER_ENUM.TURNLEFT | CONTROLLER_ENUM.TURNRIGHT,
    direction: DIRECTION_ENUM,
    x: number,
    y: number,
    tileInfo: Array<Array<TileManager>>,
  ): boolean {
    const weaponOffset = TURN_DIRECTIONS[inputDirection][direction]
    const TurnTile = weaponOffset.map(item => {
      return tileInfo[item.x + x][item.y + y]
    })
    if (!TurnTile[0].turnable || !TurnTile[1].turnable) {
      return true
    }
    return false
  }
}
