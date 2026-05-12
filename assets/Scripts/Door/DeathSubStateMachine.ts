import State from '../../Base/State'
import { DIRECTION_ENUM } from '../../Enums'
import { AnimationClip } from 'cc'
import { DoorMachine } from './DoorMachine'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'

const BaseURL = 'texture/door/death'

export default class DeathSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: DoorMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BaseURL}`))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BaseURL}`))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BaseURL}`))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BaseURL}`))
  }
}
