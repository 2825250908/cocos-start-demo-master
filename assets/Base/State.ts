import { animation, AnimationClip, Sprite, SpriteFrame } from 'cc'
import { PlayerStateMachine } from '../Scripts/player/PlayerStateMachine'
import { ResoureceManager } from '../Runtime/ResoureceManager'

/**
 *  管理角色动画状态
 * 1.需要知道aimationClip是什么
 * 2.需要播放动画的能力
 */
const ANIMATION_SPEED = 1 / 8

export default class State {
  private animationClip: AnimationClip = null
  constructor(
    private fsm: PlayerStateMachine, // 状态机
    private path: string, // 动画路径
    private wrapMode: AnimationClip.WrapMode = AnimationClip.WrapMode.Normal, // 动画循环模式
  ) {
    this.init()
  }
  // 动画初始化
  async init() {
    // 从资源管理器异步加载角色闲置状态的精灵帧序列
    const promise = ResoureceManager.Instance.loadRes(this.path)
    this.fsm.waitingList.push(promise)
    const spriteFrames = await promise
    // 创建新的动画剪辑对象
    this.animationClip = new AnimationClip()

    // 创建对象轨道用于控制 Sprite 组件的 spriteFrame 属性
    const track = new animation.ObjectTrack()
    track.path = new animation.TrackPath().toComponent(Sprite).toProperty('spriteFrame')
    // 将精灵帧序列转换为带时间戳的帧数据，每帧间隔为 ANIMATION_SPEED
    const frames: Array<[number, SpriteFrame]> = spriteFrames.map((item: SpriteFrame, index: number) => [
      index * ANIMATION_SPEED,
      item,
    ])

    // 将帧数据分配到轨道通道曲线中
    track.channel.curve.assignSorted(frames)
    // 将轨道添加到动画剪辑中
    this.animationClip.addTrack(track)
    // 给动画状态设置名称
    this.animationClip.name = this.path
    // 设置动画总时长为帧数乘以帧间隔
    this.animationClip.duration = frames.length * ANIMATION_SPEED
    // 设置动画循环模式为循环播放
    this.animationClip.wrapMode = this.wrapMode
  }
  run() {
    this.fsm.animationComponent.defaultClip = this.animationClip
    this.fsm.animationComponent.play()
  }
}
