import State from '../../Base/State'
import { DIRECTION_ENUM } from '../../Enums'
import { AnimationClip } from 'cc'
import { DoorMachine } from './DoorMachine'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'

const BaseURL = 'texture/door/idle'

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: DoorMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BaseURL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BaseURL}/top`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BaseURL}/left`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BaseURL}/left`))
  }
}
