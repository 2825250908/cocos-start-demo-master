import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import { DIRECTION_ENUM } from '../../Enums'
import { PlayerStateMachine } from './PlayerStateMachine'
import { AnimationClip } from 'cc'

const BaseURL = 'texture/player/turnleft'

export default class TurnLeftSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: PlayerStateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BaseURL}/top`, AnimationClip.WrapMode.Normal))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BaseURL}/bottom`, AnimationClip.WrapMode.Normal))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BaseURL}/left`, AnimationClip.WrapMode.Normal))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BaseURL}/right`, AnimationClip.WrapMode.Normal))
  }
}
