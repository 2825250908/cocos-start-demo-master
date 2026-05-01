import Singleton from '../Base/Singleton'
interface IItem {
  func: Function
  ctx: unknown
}

export class EventManager extends Singleton {
  // 单例话
  static get Instance() {
    return super.getInstance<EventManager>()
  }
  // 创建私有化事件总线
  private eventDic: Map<string, Array<IItem>> = new Map()
  // 事件总线总注册事件
  on(envtName: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(envtName)) {
      this.eventDic.get(envtName).push({ func, ctx })
    } else {
      this.eventDic.set(envtName, [{ func, ctx }])
    }
  }
  // 事件总线中卸载事件
  off(envtName: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(envtName)) {
      const index = this.eventDic.get(envtName).findIndex(i => i.func === func)
      index > -1 && this.eventDic.get(envtName).splice(index, 1)
    }
  }
  // 事件总线中调用事件
  emit(envtName: string, ...params: unknown[]) {
    if (this.eventDic.has(envtName)) {
      this.eventDic.get(envtName).forEach(i => {
        i.ctx ? i.func.apply(i.ctx, params) : i.func(...params)
      })
    }
  }
  // 卸载所有事件
  clear() {
    this.eventDic.clear()
  }
}
