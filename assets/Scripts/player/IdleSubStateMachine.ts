import State from '../../Base/State'
import { DIRECTION_ENUM, DIRECTION_ORDER_ENUM, PARAMS_NAME_ENUM } from '../../Enums'
import { AnimationClip } from 'cc'
import { PlayerStateMachine } from './PlayerStateMachine'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'

export default class IdleSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: PlayerStateMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, 'texture/player/idle/top', AnimationClip.WrapMode.Loop))
    this.stateMachines.set(
      DIRECTION_ENUM.BOTTOM,
      new State(fsm, 'texture/player/idle/bottom', AnimationClip.WrapMode.Loop),
    )
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, 'texture/player/idle/left', AnimationClip.WrapMode.Loop))
    this.stateMachines.set(
      DIRECTION_ENUM.RIGHT,
      new State(fsm, 'texture/player/idle/right', AnimationClip.WrapMode.Loop),
    )
  }
}
