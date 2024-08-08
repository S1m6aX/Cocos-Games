import { _decorator, Component, Enum, EventMouse, Node, Sprite } from "cc";
import { SunManager } from "./Managers/SunManager";
import { MouseManager } from "./Managers/MouseManager";
import { CardState, PlantType } from "./Global";
const { ccclass, property } = _decorator;

@ccclass("Card")
export class Card extends Component {
  @property({ type: Enum(PlantType) })
  public plantType: PlantType;

  @property(Node)
  public cardLight: Node;

  @property(Node)
  public cardGrey: Node;

  @property(Sprite)
  public cardMask: Sprite;

  @property(Number)
  public cdTime: number = 2;

  @property({ type: Number, tooltip: "卡牌需要的阳光值" })
  public sunCosts: number = 50;

  private cdTimer: number = 0;
  private cardState: CardState = CardState.Cooling;
  start() {
    this.cdTimer = this.cdTime;
  }

  update(deltaTime: number) {
    switch (this.cardState) {
      case CardState.Cooling:
        this.CoolingUpdate(deltaTime);
        if (this.cdTimer <= 0) {
          this.transitionToWaiting();
        }
        break;
      case CardState.Waiting:
        this.WaitingUpdate();
        break;
      case CardState.Ready:
        this.ReadyUpdate();
        break;
    }
  }

  private CoolingUpdate(dt: number) {
    this.cdTimer -= dt;
    this.cardMask.fillRange = this.cdTimer / this.cdTime;
  }

  private WaitingUpdate() {
    if (this.sunCosts <= SunManager.Instance.SunPoint) {
      this.transitionToReady();
    }
  }

  private ReadyUpdate() {
    if (this.sunCosts > SunManager.Instance.SunPoint) {
      this.transitionToWaiting();
    }
  }

  transitionToWaiting() {
    this.cardState = CardState.Waiting;
    this.cardLight.active = false;
    this.cardGrey.active = true;
    this.cardMask.node.active = false;
  }

  transitionToReady() {
    this.cardState = CardState.Ready;
    this.cardLight.active = true;
    this.cardGrey.active = false;
    this.cardMask.node.active = false;
  }

  transitionToCooling() {
    this.cardState = CardState.Cooling;
    this.cdTimer = this.cdTime;
    this.cardLight.active = false;
    this.cardGrey.active = true;
    this.cardMask.node.active = true;
  }

  onClick(event: EventMouse) {
    if (this.sunCosts > SunManager.Instance.SunPoint) {
      return;
    }

    let isSuccess = MouseManager.Instance.addPlant(this.plantType, event);
    if (isSuccess) {
      SunManager.Instance.subSun(this.sunCosts);
      this.transitionToCooling();
    }
  }
}
