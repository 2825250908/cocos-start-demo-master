import { _decorator, resources, SpriteFrame } from 'cc'
import Singleton from '../Base/Singleton'

export class ResoureceManager extends Singleton {
  static get Instance() {
    return super.getInstance<ResoureceManager>()
  }
  // 异步加载图片资源
  loadRes(path: string) {
    return new Promise<SpriteFrame[]>((resolve, reject) => {
      resources.loadDir(path, SpriteFrame, function (err, assets) {
        if (err) {
          reject(err)
          return
        }
        const sortedAssets = assets.sort((a, b) => {
          return a.name.localeCompare(b.name)
        })
        resolve(sortedAssets)
      })
    })
  }
}
