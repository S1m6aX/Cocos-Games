import {
  _decorator,
  Component,
  EventMouse,
  find,
  Input,
  input,
  instantiate,
  Node,
  Prefab,
  Vec3,
} from "cc";
import { PlantType } from "../Global";
import { Plant } from "../Plant";
import { Cell } from "./Cell";
const { ccclass, property } = _decorator;

@ccclass("MouseManager")
export class MouseManager extends Component {
  private static _instance: MouseManager = null;

  @property([Prefab])
  public plantPrefabArray: Prefab[] = [];

  private currentPlant: Node;

  /**
   * 获取实例
   */
  public static get Instance(): MouseManager {
    return this._instance;
  }

  protected onLoad(): void {
    if (MouseManager._instance == null) {
      MouseManager._instance = this;
    } else {
      console.log("MouseManager is already exist");
      this.node.destroy();
      return;
    }

    input.on(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
  }

  protected onDestroy(): void {
    input.off(Input.EventType.MOUSE_MOVE, this.onMouseMove, this);
  }
  start() {}

  update(deltaTime: number) {}

  onMouseMove(event: EventMouse) {
    this.followCursor(event);
  }

  /**
   * 跟随光标的函数方法
   * @param event
   */
  followCursor(event: EventMouse) {
    // 将鼠标位置转化为世界坐标
    let mousePos = event.getUILocation();
    let worldPos = new Vec3(mousePos.x, mousePos.y, 0);
    // 如果当前有植物对象，则设置其世界位置为鼠标对应的世界坐标
    if (this.currentPlant != null) {
      this.currentPlant.setWorldPosition(worldPos);
    }
  }

  addPlant(plantType: PlantType, event: EventMouse): boolean {
    if (this.currentPlant != null) {
      return false;
    }
    let plantPrefab = this.getPlantPrefab(plantType);
    if (plantPrefab == null) {
      console.log("Cannot found Prefab");
      return false;
    }
    this.currentPlant = plantPrefab;
    this.currentPlant.parent = find("Canvas/Game");
    this.followCursor(event);
    return true;
  }

  getPlantPrefab(plantType: PlantType): Node {
    for (let plantPrefab of this.plantPrefabArray) {
      // 实例植物预制体
      let plantNode = instantiate(plantPrefab);
      // 判断实例化后的植物节点的植物类型是否与传入的植物类型相同
      if (plantNode.getComponent(Plant).plantType == plantType) {
        // 如果相同，返回该节点
        return plantNode;
      } else {
        // 如果不同，销毁该节点
        plantNode.destroy();
      }
    }
    // 如果遍历完所有预制体后仍未找到匹配项， 则返回null
    return null;
  }

  onCellClick(cell: Cell) {
    // 如果当前植物对象为null，则直接返回
    if (this.currentPlant == null) {
      return;
    }
    // 设置当前植物对象的位置为点击格子的位置
    let isSuccess = cell.addPlant(this.currentPlant);
    // 如果植物添加成功，释放当前植物对象
    if (isSuccess) {
      this.currentPlant = null;
    }
  }
}
