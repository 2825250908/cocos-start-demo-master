import { _decorator, Component, Animation, SpriteFrame } from 'cc'
import { FSM_PARAMS_TYPE_ENUM, PARAMS_NAME_ENUM } from '../Enums'
import State from '../Base/State'
import { SubStateMachine } from './SubStateMachine'
const { ccclass, property } = _decorator

type ParamsValueTYPE = Boolean | number

export interface IParamsValue {
  type: FSM_PARAMS_TYPE_ENUM // 参数类型
  value: ParamsValueTYPE // 参数值
}
export const getInitParamsTrigger = () => {
  return {
    type: FSM_PARAMS_TYPE_ENUM.TRIGGER,
    value: false,
  }
}

/**
 * 玩家状态管理器
 * 负责玩家状态的切换，如：移动、攻击、技能、死亡
 */
@ccclass('StateMachine')
export abstract class StateMachine extends Component {
  // 当前状态z
  private _currentState: State | SubStateMachine = null
  params: Map<string, IParamsValue> = new Map() // 参数列表
  stateMachines: Map<string, State | SubStateMachine> = new Map() // 状态机列表
  animationComponent: Animation = null // 动画组件
  waitingList: Array<Promise<SpriteFrame[]>> = [] // 等待列表
  // 获取当前状态
  get currentState() {
    return this._currentState
  }
  // 设置当前状态
  set currentState(newState: State | SubStateMachine) {
    this._currentState = newState
    this._currentState.run()
  }

  getParams(paramsName: PARAMS_NAME_ENUM) {
    if (this.params.has(paramsName)) {
      return this.params.get(paramsName).value
    }
  }
  setParams(paramsName: PARAMS_NAME_ENUM, value: ParamsValueTYPE) {
    if (this.params.has(paramsName)) {
      this.params.get(paramsName).value = value
      this.run()
      this.resetTrigger()
    }
  }

  // 重置触发器状态
  resetTrigger() {
    for (const [_, item] of this.params) {
      if (item.type === FSM_PARAMS_TYPE_ENUM.TRIGGER) {
        item.value = false
      }
    }
  }
  abstract init(): void
  // 状态机更新
  abstract run(): void
}
