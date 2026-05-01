import { _decorator, Component, Sprite, resources, SpriteFrame, UITransform, Layers } from 'cc'
import { createUINode, randomByRange } from '../Utils'
import { TileManager } from '../Tile/TileManager'
import { DataManager } from '../../Runtime/DataManager'
import { ResoureceManager } from '../../Runtime/ResoureceManager'
const { ccclass, property } = _decorator

@ccclass('TileMapManager')
export class TileMapManager extends Component {
  async init() {
    // 获取地图瓦片信息
    const { mapInfo } = DataManager.Instance
    // 动态获取图片信息
    const spriteFrames = await ResoureceManager.Instance.loadRes('texture/tile/tile')
    DataManager.Instance.tileInfo = []
    // 解构第一层
    for (let i = 0; i < mapInfo.length; i++) {
      const column = mapInfo[i]
      // 结构第二层拿到单个瓦片信息
      DataManager.Instance.tileInfo[i] = []
      for (let j = 0; j < column.length; j++) {
        const item = column[j]
        // scr为空或者type为空的时候跳出循环
        if (item.src === null || item.type === null) {
          continue
        }
        // 创建node节点
        const node = createUINode('Sprite')
        if ((item.src === 1 || item.src === 5 || item.src === 9) && i % 2 === 0 && j % 2 === 0) {
          item.src = randomByRange(item.src + 4, item.src - 1)
        }
        // 获取瓦片id
        const imgSrc = `tile (${item.src})`
        // 循环图片信息根据id找到对应图片
        const spriteFrame = spriteFrames.find(v => v.name === imgSrc) || spriteFrames[0]
        // 初始化瓦片地图信息
        const tileManager = node.addComponent(TileManager)
        DataManager.Instance.tileInfo[i][j] = tileManager
        const type = item.type
        tileManager.init(type, spriteFrame, i, j)
        // 最终将瓦片图片插入到调用者身上
        node.setParent(this.node)
      }
    }
  }
}
