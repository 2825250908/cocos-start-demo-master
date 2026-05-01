import { _decorator } from 'cc'
import State from '../Base/State'
import { StateMachine } from './StateMachine'
const { ccclass, property } = _decorator

@ccclass('SubStateMachine')
export abstract class SubStateMachine {
  // 当前状态z
  private _currentState: State = null
  stateMachines: Map<string, State> = new Map() // 状态机列表

  constructor(public fsm: StateMachine) {
    this.fsm = fsm
  }
  // 获取当前状态
  get currentState() {
    return this._currentState
  }
  // 设置当前状态
  set currentState(newState: State) {
    this._currentState = newState
    this._currentState.run()
  }
  abstract run(): void
}
