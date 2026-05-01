import { _decorator, Animation } from 'cc'
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums'
import { StateMachine } from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine'
import TurnRightSubStateMachine from './TurnRightSubStateMachine'
import BlockBackSubStateMachine from './BlockBackSubStateMachine'
import BlockFrontSubStateMachine from './BlockFrontSubStateMachine'
import BlockLeftSubStateMachine from './BlockLeftSubStateMachine'
import BlockRightSubStateMachine from './BlockRightSubStateMachine'
import BlockTurnRightSubStateMachine from './BlockTurnRightSubStateMachine'
import BlocTurnLeftSubStateMachine from './BlocTurnLeftSubStateMachine'
const { ccclass, property } = _decorator

type ParamsValueTYPE = Boolean | number

export interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM // 参数类型
  value: ParamsValueTYPE // 参数值
}
export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER, // 当前状态
    value: false,
  }
}

export const getInitParamsNumber = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.NUMBER, // 当前方向
    value: 0,
  }
}

/**
 * 玩家状态管理器
 * 负责玩家状态的切换，如：移动、攻击、技能、死亡
 */
@ccclass('PlayerStateMachine')
export class PlayerStateMachine extends StateMachine {
  async init() {
    // 创建动画组件
    this.animationComponent = this.addComponent(Animation)
    // 初始化参数列表
    this.initParams()
    // 初始化状态机列表
    this.initStateMachine()
    // 动画事件回调
    this.initAnimationEvent()
    // 等待所有资源加载完成
    await Promise.all(this.waitingList)
  }
  // 初始化状态机参数列表
  initParams() {
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger()) // 添加闲置动画
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger()) // 添加左转动画
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT, getInitParamsTrigger()) // 添加右转动画
    this.params.set(PARAMS_NAME_ENUM.BLOCKBACK, getInitParamsTrigger()) // 添加后退撞墙动画
    this.params.set(PARAMS_NAME_ENUM.BLOCKFRONT, getInitParamsTrigger()) // 添加前进撞墙动画
    this.params.set(PARAMS_NAME_ENUM.BLOCKLEFT, getInitParamsTrigger()) //  添加左移撞墙动画
    this.params.set(PARAMS_NAME_ENUM.BLOCKRIGHT, getInitParamsTrigger()) // 添加右移撞墙动画
    this.params.set(PARAMS_NAME_ENUM.BLCOKTURNRIGHT, getInitParamsTrigger()) // 添加右转撞墙动画
    this.params.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, getInitParamsTrigger()) // 添加左转撞墙动画
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber()) // 添加方向状态列表
  }
  // 状态机列表初始化
  initStateMachine() {
    // 初始化闲置动画
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    // 初始化左转动画
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
    // 初始化右转动画
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this))
    // 初始化后退撞墙动画
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKBACK, new BlockBackSubStateMachine(this))
    // 初始化前进撞墙动画
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKFRONT, new BlockFrontSubStateMachine(this))
    // 初始化左移撞墙动画
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKLEFT, new BlockLeftSubStateMachine(this))
    // 初始化右移撞墙动画
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKRIGHT, new BlockRightSubStateMachine(this))
    // 初始化右转撞墙动画
    this.stateMachines.set(PARAMS_NAME_ENUM.BLCOKTURNRIGHT, new BlockTurnRightSubStateMachine(this))
    // 初始化左转撞墙动画
    this.stateMachines.set(PARAMS_NAME_ENUM.BLOCKTURNLEFT, new BlocTurnLeftSubStateMachine(this))
  }
  // 动画结束时候的回调
  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whitelList = ['idle']
      if (whitelList.some(item => !name.includes(item))) {
        this.setParams(PARAMS_NAME_ENUM.IDLE, true)
      }
    })
    // 获取当前动画组件的名称
  }
  // 状态机更新
  run() {
    switch (this.currentState) {
      case this.stateMachines.get(PARAMS_NAME_ENUM.IDLE):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLCOKTURNRIGHT):
      case this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT):
        if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKBACK).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKBACK)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKFRONT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKFRONT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKRIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKRIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLCOKTURNRIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLCOKTURNRIGHT)
        } else if (this.params.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.BLOCKTURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.IDLE).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
        } else {
          this.currentState = this.currentState
        }
        break
      default:
        this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.IDLE)
    }
  }
}
