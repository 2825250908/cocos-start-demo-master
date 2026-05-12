import State from '../../Base/State'
import { DIRECTION_ENUM } from '../../Enums'
import { AnimationClip } from 'cc'
import { WoodenSkeletonMachine } from './WoodenSkeletonMachine'
import DirectionSubStateMachine from '../../Base/DirectionSubStateMachine'

const BaseURL = 'texture/woodenskeleton/death'

export default class DeathSubStateMachine extends DirectionSubStateMachine {
  constructor(fsm: WoodenSkeletonMachine) {
    super(fsm)
    this.stateMachines.set(DIRECTION_ENUM.TOP, new State(fsm, `${BaseURL}/top`, AnimationClip.WrapMode.Normal))
    this.stateMachines.set(DIRECTION_ENUM.BOTTOM, new State(fsm, `${BaseURL}/bottom`, AnimationClip.WrapMode.Normal))
    this.stateMachines.set(DIRECTION_ENUM.LEFT, new State(fsm, `${BaseURL}/left`, AnimationClip.WrapMode.Normal))
    this.stateMachines.set(DIRECTION_ENUM.RIGHT, new State(fsm, `${BaseURL}/right`, AnimationClip.WrapMode.Normal))
  }
}
