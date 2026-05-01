import { Layers, Node, UITransform } from 'cc'

//初始化node节点
export const createUINode = (name: string = '') => {
  const node = new Node(name)
  // 设置节点类型
  const transform = node.addComponent(UITransform)
  // 修改节点默认坐标
  transform.setAnchorPoint(0, 1)
  // 设置layer层类型
  node.layer = 1 << Layers.nameToLayer('UI_2D')
  return node
}

// 取随机数
export const randomByRange = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

64
