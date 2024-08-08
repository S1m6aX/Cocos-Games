import { _decorator, Component, Label, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("SunManager")
export class SunManager extends Component {
  private static _instance: SunManager = null;
  @property(Number)
  private sunPoint: number = 0; // 阳光值
  @property(Label)
  private sunPointLabel: Label = null;
  /**
   * 获取实例
   */
  public static get Instance(): SunManager {
    return this._instance;
  }

  /**
   * 公共访问器 阳光值
   */
  public get SunPoint(): number {
    return this.sunPoint;
  }

  protected onLoad(): void {
    // 确保全局只有一个实例
    if (SunManager._instance == null) {
      SunManager._instance = this;
    } else {
      console.log("SunManager is already exist");
      this.node.destroy();
      return;
    }
  }
  start() {
    this.updateSunPoint();
  }

  update(deltaTime: number) {}

  /**
   * 更新阳光文本显示
   */
  private updateSunPoint(): void {
    this.sunPointLabel.string = this.sunPoint.toString();
  }

  /**
   * 减少阳光值的方法
   * @param point 减少的阳光值
   */
  public subSun(point: number): void {
    this.sunPoint -= point;
    if (this.sunPoint < 0) {
      this.sunPoint = 0;
    }
    this.updateSunPoint();
  }
}
