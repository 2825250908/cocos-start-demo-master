import { _decorator, Component, Node } from 'cc'
import { EventManager } from '../../Runtime/EventManager'
import { EVENT_ENUM, CONTROLLER_ENUM } from '../../Enums'
const { ccclass, property } = _decorator

@ccclass('ControllerManager')
export class ControllerManager extends Component {
  start() {
    // [3]
  }
  // 监听事件
  handleCtrl(evn: Event, type: string) {
    EventManager.Instance.emit(EVENT_ENUM.PLAYER_CTRL, type as CONTROLLER_ENUM)
  }
}
