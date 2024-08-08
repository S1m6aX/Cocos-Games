import { _decorator, Component, EventMouse, Node } from "cc";
import { MouseManager } from "./MouseManager";
import { Plant } from "../Plant";
const { ccclass, property } = _decorator;

@ccclass("Cell")
export class Cell extends Component {
  public currentPlant: Node = null;

  protected onLoad(): void {
    this.node.on(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    this.node.on(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
  }

  protected onDestroy(): void {
    this.node.off(Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
    this.node.off(Node.EventType.MOUSE_MOVE, this.onMouseMove, this);
  }

  onMouseDown(EventMouse: EventMouse) {
    MouseManager.Instance.onCellClick(this);
  }

  onMouseMove(event: EventMouse) {
    MouseManager.Instance.followCursor(event);
  }

  addPlant(plant: Node): boolean {
    if (this.currentPlant) {
      return false;
    }
    this.currentPlant = plant;
    this.currentPlant.setPosition(this.node.position);
    plant.getComponent(Plant).transitionToEnable();
    return true;
  }
}
