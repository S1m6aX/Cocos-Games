import { _decorator, animation, Animation, Component, Enum, Node } from "cc";
import { PlantState, PlantType } from "./Global";
const { ccclass, property } = _decorator;

@ccclass("Plant")
export class Plant extends Component {
  @property({ type: Enum(PlantType) })
  public plantType: PlantType;
  plantState: PlantState = PlantState.Disable;
  protected start(): void {
    this.transitionToDisable();
  }

  update(deltaTime: number) {
    switch (this.plantState) {
      case PlantState.Disable:
        this.disableUpdate();
        break;
      case PlantState.Enable:
        this.enableUpdate();
        break;
    }
  }

  disableUpdate() {
    return;
  }

  enableUpdate() {
    return;
  }

  transitionToDisable() {
    this.plantState = PlantState.Disable;
    this.getComponent(animation.AnimationController).enabled = false;
  }

  transitionToEnable() {
    this.plantState = PlantState.Enable;
    this.getComponent(Animation).enabled = true;
  }

  generateSun() {}
}
