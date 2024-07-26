const { ccclass, property } = cc._decorator;

@ccclass
export default class BulletControl extends cc.Component {
  @property
  speed: number = 800;

  public isPause: boolean = false;
  start() {}

  update(dt) {
    // 移动
    if (!this.isPause) {
      this.node.y += this.speed * dt;
      // 出屏幕销毁
      if (this.node.y > 1146) {
        this.node.destroy();
      }
    }
  }

  onCollisionEnter(other) {
    this.node.destroy();
  }
}
