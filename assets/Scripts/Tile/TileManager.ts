import { _decorator, Component, SpriteFrame, Sprite, UITransform } from 'cc'
import { TILE_TYPE_ENUM } from '../../Enums'
const { ccclass, property } = _decorator

export const TILE_WIDTH = 55
export const TILE_HEIGHT = 55

@ccclass('TileManager')
export class TileManager extends Component {
  type: TILE_TYPE_ENUM
  movable: boolean // 是否可移动
  turnable: boolean // 是否可旋转
  init(type: TILE_TYPE_ENUM, spriteFrames: SpriteFrame, i: number, j: number) {
    this.type = type
    if (
      this.type === TILE_TYPE_ENUM.WALL_ROW ||
      this.type === TILE_TYPE_ENUM.WALL_COLUMN ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_TOP ||
      this.type === TILE_TYPE_ENUM.WALL_LEFT_BOTTOM ||
      this.type === TILE_TYPE_ENUM.WALL_RIGHT_BOTTOM
    ) {
      this.movable = false
      this.turnable = false
    } else if (
      this.type === TILE_TYPE_ENUM.CLIFF_CENTER ||
      this.type === TILE_TYPE_ENUM.CLIFF_LEFT ||
      this.type === TILE_TYPE_ENUM.CLIFF_RIGHT
    ) {
      this.movable = false
      this.turnable = true
    } else if (this.type === TILE_TYPE_ENUM.FLOOR) {
      this.movable = true
      this.turnable = true
    }
    // 创建瓦片渲染节点
    const sprite = this.addComponent(Sprite)
    // 循环图片信息根据id找到对应图片
    sprite.spriteFrame = spriteFrames
    const transform = this.getComponent(UITransform)
    // 设置瓦片的宽高大小
    transform.setContentSize(TILE_WIDTH, TILE_HEIGHT)
    // 设置精灵图节点的坐标
    this.node.setPosition(i * TILE_WIDTH, -j * TILE_HEIGHT)
  }
}
