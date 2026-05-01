import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'
import State from '../../Base/State'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../../Enums'
import { PlayerStateMachine } from './PlayerStateMachine'
import { AnimationClip } from 'cc'

export default class TurnRightSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: PlayerStateMachine) {
    super(fsm)
    this.stateMachines.set(
      DIRECTION_ENUM.TOP,
      new State(fsm, 'texture/player/turnright/top', AnimationClip.WrapMode.Normal),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.BOTTOM,
      new State(fsm, 'texture/player/turnright/bottom', AnimationClip.WrapMode.Normal),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.LEFT,
      new State(fsm, 'texture/player/turnright/left', AnimationClip.WrapMode.Normal),
    )
    this.stateMachines.set(
      DIRECTION_ENUM.RIGHT,
      new State(fsm, 'texture/player/turnright/right', AnimationClip.WrapMode.Normal),
    )
  }
}
