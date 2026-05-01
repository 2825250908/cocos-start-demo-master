import { _decorator, Animation } from 'cc'
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../../Enums'
import { StateMachine } from '../../Base/StateMachine'
import IdleSubStateMachine from './IdleSubStateMachine'
import TurnLeftSubStateMachine from './TurnLeftSubStateMachine'
import TurnRightSubStateMachine from './TurnRightSubStateMachine'
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
    this.params.set(PARAMS_NAME_ENUM.IDLE, getInitParamsTrigger()) // 添加闲置状态
    this.params.set(PARAMS_NAME_ENUM.TURNLEFT, getInitParamsTrigger()) // 添加左转状态
    this.params.set(PARAMS_NAME_ENUM.TURNRIGHT, getInitParamsTrigger()) // 添加左转状态
    this.params.set(PARAMS_NAME_ENUM.DIRECTION, getInitParamsNumber()) // 添加方向状态
  }
  // 状态机列表初始化
  initStateMachine() {
    // 初始化闲置状态
    this.stateMachines.set(PARAMS_NAME_ENUM.IDLE, new IdleSubStateMachine(this))
    // 初始化左转状态
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNLEFT, new TurnLeftSubStateMachine(this))
    // 初始化右转状态
    this.stateMachines.set(PARAMS_NAME_ENUM.TURNRIGHT, new TurnRightSubStateMachine(this))
  }
  // 动画结束时候的回调
  initAnimationEvent() {
    this.animationComponent.on(Animation.EventType.FINISHED, () => {
      const name = this.animationComponent.defaultClip.name
      const whitelList = ['turnleft', 'turnright']
      if (whitelList.some(item => name.includes(item))) {
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
        if (this.params.get(PARAMS_NAME_ENUM.TURNLEFT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNLEFT)
        } else if (this.params.get(PARAMS_NAME_ENUM.TURNRIGHT).value) {
          this.currentState = this.stateMachines.get(PARAMS_NAME_ENUM.TURNRIGHT)
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
