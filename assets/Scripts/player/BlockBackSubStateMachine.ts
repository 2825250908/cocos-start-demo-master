import State from '../../Base/State'
import { DIRECTION_ENUM } from '../../Enums'
import { AnimationClip } from 'cc'
import { PlayerStateMachine } from './PlayerStateMachine'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'

const BaseURL = 'texture/player/blockback'

export default class BlockBackSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: PlayerStateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BaseURL}/top`, AnimationClip.WrapMode.Normal))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BaseURL}/bottom`, AnimationClip.WrapMode.Normal))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BaseURL}/left`, AnimationClip.WrapMode.Normal))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BaseURL}/right`, AnimationClip.WrapMode.Normal))
  }
}
