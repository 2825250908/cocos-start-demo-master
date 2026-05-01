# 实现流程梳理

## 1. 项目结构

```
assets/
├── Base/
│   └── Singleton.ts           # 单例基类
├── Enums/
│   └── index.ts               # 枚举定义
├── Levels/
│   ├── Level1.ts              # 关卡1数据
│   ├── Level2.ts              # 关卡2数据
│   └── index.ts               # 关卡数据导出
├── Runtime/
│   ├── DataManager.ts         # 数据管理单例
│   └── EventManager.ts        # 事件管理单例
├── Scene/
│   └── Battle.scene           # 战斗场景
└── Scripts/
    ├── Scene/
    │   └── BattleManager.ts   # 战斗管理器
    ├── Tile/
    │   ├── TileManager.ts     # 瓦片管理
    │   └── TileMapManager.ts  # 地图管理
    ├── UI/
    │   └── ControllerManager.ts # 控制器管理
    └── player/
        ├── PlayerManager.ts   # 玩家管理
        └── PlayerStateMachine.ts # 玩家状态机
```

## 2. 单例模式实现

### 核心原理
- 静态成员存储唯一实例
- 懒加载机制
- 继承链中的 `this` 指向

### 核心代码

**Singleton.ts**
```typescript
export default class Singleton {
  private static _instance: any = null
  static getInstance<T>(): T {
    if (!this._instance) {
      this._instance = new this()
    }
    return this._instance
  }
}
```

**EventManager.ts**
```typescript
import Singleton from '../Base/Singleton'
interface IItem {
  func: Function
  ctx: unknown
}

export class EventManager extends Singleton {
  static get Instance() {
    return super.getInstance<EventManager>()
  }
  private eventDic: Map<string, Array<IItem>> = new Map()
  on(envtName: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(envtName)) {
      this.eventDic.get(envtName).push({ func, ctx })
    } else {
      this.eventDic.set(envtName, [{ func, ctx }])
    }
  }
  off(envtName: string, func: Function, ctx?: unknown) {
    if (this.eventDic.has(envtName)) {
      const index = this.eventDic.get(envtName).findIndex(i => i.func === func)
      index > -1 && this.eventDic.get(envtName).splice(index, 1)
    }
  }
  emit(envtName: string, ...params: unknown[]) {
    if (this.eventDic.has(envtName)) {
      this.eventDic.get(envtName).forEach(i => {
        i.ctx ? i.func.apply(i.ctx, params) : i.func(...params)
      })
    }
  }
  clear() {
    this.eventDic.clear()
  }
}
```

**DataManager.ts**
```typescript
import Singleton from '../Base/Singleton'
import { ITile } from '../Levels'

export class DataManager extends Singleton {
  static get Instance() {
    return super.getInstance<DataManager>()
  }
  mapInfo: Array<Array<ITile>>
  mapRowCount: number = 0
  mapColumnCount: number = 0
  levelindex: number = 1
  reset() {
    this.mapInfo = []
    this.mapRowCount = 0
    this.mapColumnCount = 0
  }
}
```

### 执行流程
1. 首次访问 `EventManager.Instance`
2. 调用 `super.getInstance<EventManager>()`
3. 父类 `Singleton` 检查 `_instance` 是否为 null
4. 不存在则创建 `EventManager` 实例（`new this()` 中的 `this` 指向 `EventManager`）
5. 存储并返回实例
6. 后续访问直接返回已存储的实例

## 3. 事件系统实现

### 核心组件
- EventManager（事件总线）
- 事件注册、触发、注销方法

### 实现细节
- 使用 `Map` 存储事件与回调
- 支持上下文绑定
- 事件触发时传递参数

### 事件流程
1. 组件通过 `EventManager.Instance.on()` 注册事件
2. 其他组件通过 `EventManager.Instance.emit()` 触发事件
3. 注册的回调函数被执行
4. 组件销毁时通过 `EventManager.Instance.off()` 注销事件

## 4. 场景初始化流程

### 执行顺序
1. **引擎启动**：Cocos 引擎初始化
2. **加载场景**：加载 `Battle.scene` 文件
3. **初始化 Canvas**：创建 Canvas 节点及其子节点
4. **BattleManager 初始化**：
   - `onLoad()`：注册 `NEXT_LEVEL` 事件
   - `start()`：生成舞台、初始化关卡
5. **单例初始化**：
   - 首次访问 `DataManager.Instance` 和 `EventManager.Instance` 时创建实例
6. **关卡初始化**：
   - 加载关卡数据
   - 初始化地图信息
   - 生成瓦片地图
   - 生成玩家角色
7. **游戏循环**：进入主循环，响应用户输入

### BattleManager 核心代码

**BattleManager.ts**
```typescript
import { _decorator, Component, Node } from 'cc'
import { TileMapManager } from '../Tile/TileMapManager'
import { PlayerManager } from '../player/PlayerManager'
import { EVENT_ENUM } from '../../Enums'
import { createUINode } from '../Utils/index'
import Levels, { Ilevel } from '../../Levels'
import { DataManager } from '../../Runtime/DataManager'
import { EventManager } from '../../Runtime/EventManager'
import { TILE_HEIGHT, TILE_WIDTH } from '../Tile/TileManager'
const { ccclass, property } = _decorator

@ccclass('BattleManager')
export class BattleManager extends Component {
  Level: Ilevel
  stage: Node
  start() {
    this.generateStage()
    this.initLevel()
  }
  onLoad(): void {
    EventManager.Instance.on(EVENT_ENUM.NEXT_LEVEL, this.nextLevel, this)
  }
  onDestroy(): void {
    EventManager.Instance.off(EVENT_ENUM.NEXT_LEVEL, this.nextLevel)
  }
  initLevel() {
    const level = Levels[`Level${DataManager.Instance.levelindex}`]
    if (level) {
      this.Level = level
      DataManager.Instance.mapInfo = this.Level.mapInfo
      DataManager.Instance.mapColumnCount = this.Level.mapInfo[0].length || 0
      DataManager.Instance.mapRowCount = this.Level.mapInfo.length || 0
      this.generateTileMap()
      this.generatePlayer()
    }
  }
  nextLevel() {
    DataManager.Instance.levelindex++
    this.clearLevel()
    this.initLevel()
  }
  lastLevel() {
    if (DataManager.Instance.levelindex === 1) return
    DataManager.Instance.levelindex--
    this.clearLevel()
    this.initLevel()
  }
  clearLevel() {
    this.stage.destroyAllChildren()
    DataManager.Instance.reset()
  }
  generateStage() {
    this.stage = createUINode('stage')
    this.stage.setParent(this.node)
  }
  generatePlayer() {
    const player = createUINode('player')
    player.setParent(this.stage)
    const playerManager = player.addComponent(PlayerManager)
    playerManager.init()
  }
  generateTileMap() {
    const tileMap = createUINode('tileMap')
    tileMap.setParent(this.stage)
    const tieMapManager = tileMap.addComponent(TileMapManager)
    tieMapManager.init()
    this.adaotPos()
  }
  adaotPos() {
    const { mapColumnCount, mapRowCount } = DataManager.Instance
    const disx = (TILE_WIDTH * mapColumnCount) / 2
    const disY = (TILE_HEIGHT * mapRowCount) / 2
    this.stage.setPosition(-disx, disY + 70)
  }
}
```

## 5. 核心技术点

### 5.1 单例模式的优势
- **懒加载**：只有在需要时才创建实例，节省内存
- **封装性**：隐藏实例创建细节，统一管理
- **唯一性**：确保全局只有一个实例，避免冲突
- **线程安全**：可实现线程安全的创建（在多线程环境中）

### 5.2 事件系统的优势
- **解耦**：组件间通过事件通信，无需直接引用
- **灵活性**：支持动态注册和注销事件
- **扩展性**：易于添加新事件，不影响现有代码
- **可维护性**：事件集中管理，便于调试和维护

### 5.3 场景初始化的流程设计
- **分层初始化**：从舞台到地图到玩家，层层递进
- **数据驱动**：通过关卡数据驱动地图和玩家的生成
- **事件监听**：使用事件系统处理关卡切换等逻辑
- **资源管理**：合理创建和销毁节点，避免内存泄漏

## 6. 执行流程图

详细的执行流程见 `implementation-flow.drawio` 文件。
